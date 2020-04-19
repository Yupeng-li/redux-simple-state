import { createSelector } from "reselect";
import state from "./state";
import { ITodo, TodosFilter } from "types/todos";

export const getVisibleTodos = createSelector(
  [state.visibilityFilter.selector, state.todos.selector],
  (visibilityFilter: TodosFilter, todos: Array<ITodo>) => {
    switch (visibilityFilter.toLocaleUpperCase()) {
      case TodosFilter.SHOW_ALL:
        return todos;
      case TodosFilter.SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case TodosFilter.SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        throw new Error("Unknown filter: " + visibilityFilter);
    }
  }
);

export const getTodoCount = createSelector(
  [state.todos.selector],
  (todos: Array<ITodo>) => todos.length
);

export const getCompletedTodoCount = createSelector(
  [state.todos.selector],
  (todos: Array<ITodo>) =>
    todos.reduce(
      (count: number, todo) => (todo.completed ? count + 1 : count),
      0
    )
);
