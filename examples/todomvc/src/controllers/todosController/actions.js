import state from "./state";

export const addTodo = todo => {
  let newId =
    state.todos.get().reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1;
  state.todos.addItem({
    text: todo,
    completed: false,
    id: newId
  });
};
export const deleteTodo = id => {
  state.todos.deleteItems(item => item.id === id);
};

export const editTodo = (id, text) => {
  state.todos.updateItems(item => item.id === id, { text });
};

export const completeTodo = id => {
  state.todos.updateItems(item => item.id === id, { completed: true });
};

export const toggleTodo = id => {
  let todo = state.todos.get().find(item => item.id === id);
  state.todos.updateItems(item => item.id === id, {
    completed: !todo.completed
  });
};

export const completeAllTodos = () => {
  const areAllMarked = state.todos.get().every(todo => todo.completed);
  state.todos.updateAll({ completed: !areAllMarked });
};

export const clearCompleted = () => {
  state.todos.deleteItems(item => item.completed);
};

export const setVisibilityFilter = filter => {
  state.visibilityFilter.set(filter);
};
