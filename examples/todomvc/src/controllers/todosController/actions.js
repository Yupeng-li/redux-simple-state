import state from './state'

export const addTodo = (todo)=>{
    state.todos.addItem(todo);
}
export const deleteTodo = id => {
    state.todos.deleteItems(item=>item.id === id);
}

export const editTodo = (id, text) => {
    state.todos.updateItem(item=>item.id === id, {text});
}

export const completeTodo = id => {
    state.todos.updateItems(item=>item.id === id, {completed: true});
}

export const completeAllTodos = () => {
    const areAllMarked = state.todos.get().every(todo => todo.completed);
    state.todos.updateAll({completed: !areAllMarked});
}

export const clearCompleted = () =>{
    state.todos.deleteItems({completed: true});
}

export const setVisibilityFilter = filter => {
    state.visibilityFilter.set(filter)
}
