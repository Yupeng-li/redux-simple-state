import { connect } from 'react-redux'
import MainSection from '../components/MainSection'
import todosController from '../controllers/todosController'

const mapStateToProps = state => ({
  todosCount: todosController.selectors.getTodoCount(state),
  completedCount: todosController.selectors.getCompletedTodoCount(state),
});

MainSection.defaultProps = {
  actions: todosController.actions,
};

export default connect(
  mapStateToProps,
  null
)(MainSection)

