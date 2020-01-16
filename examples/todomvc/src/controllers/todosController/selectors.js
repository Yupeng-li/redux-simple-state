import { createSelector } from 'reselect'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/TodoFilters'
import state from './state'

export const getVisibleTodos = createSelector(
  [state.visibilityFilter.selector, state.todos.selector],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case SHOW_ALL:
        return todos
      case SHOW_COMPLETED:
        return todos.filter(t => t.completed)
      case SHOW_ACTIVE:
        return todos.filter(t => !t.completed)
      default:
        throw new Error('Unknown filter: ' + visibilityFilter)
    }
  }
)

export const getTodoCount = createSelector(
  [state.todos.selector],
  todos => (todos.length)
)

export const getCompletedTodoCount = createSelector(
  [state.todos.selector],
  todos => (
    todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    )
  )
)