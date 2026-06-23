const express = require('express');
const redis = require('../redis/index')
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const current = await redis.get('added_todos')
  await redis.set('added_todos', current ?  Number(current) + 1 : 1 )
  res.send(todo);
});

router.get('/statistics', async (req, res) => {
  const stats = await redis.get('added_todos')
  console.log(stats)
  res.json({ added_todos: Number(stats ?? 0) })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if(!req.todo) {
    res.status(404).send({ error: 'Todo not found' });
    return;
  }
  res.status(200).send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  if(req.todo && text && done !== undefined) {
    const todo = await Todo.findById(req.todo._id);
    todo.text = text;
    todo.done = done;
    const updatedToDo = await todo.save()
    res.status(200).send(updatedToDo).end();
    return;
  }
  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
