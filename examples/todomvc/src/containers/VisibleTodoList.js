import { connect } from 'react-redux'
import TodoList from '../components/TodoList'
import todosController from '../controllers/todosController'

const mapStateToProps = state => ({
  filteredTodos: todosController.selectors.getVisibleTodos(state)
})

TodoList.defaultProps={
  actions: todosController.actions
}

const VisibleTodoList = connect(
  mapStateToProps,
  null
)(TodoList)

export default VisibleTodoList
