import { connect } from 'react-redux'
import TodoList from '../components/TodoList'
import todosController from '../controllers/todosController'

const mapStateToProps = state => ({
  filteredTodos: todosController.selectors.getVisibleTodos(state)
})

const mapDispatchToProps = dispatch => ({
  actions: todosController.actions
})


const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
