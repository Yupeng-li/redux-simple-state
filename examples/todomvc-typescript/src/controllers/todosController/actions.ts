import state from "./state";
import { TodosFilter, ITodo } from "types/todos";

export const addTodo = (text: string) => {
  let newId =
    state.todos
      .get()
      .reduce((maxId: number, todo: ITodo) => Math.max(todo.id, maxId), -1) + 1;
  state.todos.addItem({
    text: text,
    completed: false,
    id: newId
  });
};
export const deleteTodo = (id: number) => {
  state.todos.deleteItems((item: ITodo) => item.id === id);
};

export const editTodo = (id: number, text: string) => {
  state.todos.updateItems((item: ITodo) => item.id === id, { text });
};

export const completeTodo = (id: number) => {
  state.todos.updateItems((item: ITodo) => item.id === id, { completed: true });
};

export const toggleTodo = (id: number) => {
  let todo = state.todos.get().find((item: ITodo) => item.id === id);
  state.todos.updateItems((item: ITodo) => item.id === id, {
    completed: !todo.completed
  });
};

export const completeAllTodos = () => {
  const areAllMarked = state.todos.get().every((todo: ITodo) => todo.completed);
  state.todos.updateAll({ completed: !areAllMarked });
};

export const clearCompleted = () => {
  state.todos.deleteItems((item: ITodo) => item.completed);
};

export const setVisibilityFilter = (filter: TodosFilter) => {
  state.visibilityFilter.set(filter);
};
