const express = require('express');
const redis = require('../redis')
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const stats = await redis.get('added_todos')
  console.log(stats)
  res.json({ added_todos: Number(stats ?? 0) })
})


module.exports = router;
