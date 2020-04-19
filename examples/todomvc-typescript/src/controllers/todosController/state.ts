import { createState } from "redux-simple-state";
import { TodosFilter } from "types/todos";

const INITIAL_STATE = {
  todos: [],
  visibilityFilter: TodosFilter.SHOW_ALL
};

const state = createState("todos", INITIAL_STATE);
export default state;
