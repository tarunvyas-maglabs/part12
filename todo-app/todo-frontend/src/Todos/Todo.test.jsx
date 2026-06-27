import { render, screen } from '@testing-library/react'
import Todo from './Todo'

describe('<Todo/>', () => {
  const deleteTodo = vi.fn()
  const completeTodo = vi.fn()

  test('renders to do contents properly', () => {
    const todo = {
      id: '1',
      text: 'update code',
      done: false
    }
    render(<Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />)
    expect(screen.getByText('update code')).toBeVisible()
    expect(screen.getByText('This todo is not done')).toBeVisible()
    const element = screen.queryByText('This todo is done')
    expect(element).toBeNull()
  })
})