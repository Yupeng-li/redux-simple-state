import { SHOW_ALL } from '../../constants/TodoFilters'
import {createState} from 'redux-simple-state'

const INITIAL_STATE={
    todos:[],
    visibilityFilter: SHOW_ALL
}

const state = createState("todos", INITIAL_STATE)
export default state;