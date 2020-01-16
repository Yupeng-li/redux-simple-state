import { connect } from 'react-redux'
import Link from '../components/Link'
import todosController from '../controllers/todosController'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === todosController.state.filter.selector(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: () => {
    todosController.state.visibilityFilter.set(ownProps.filter)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
