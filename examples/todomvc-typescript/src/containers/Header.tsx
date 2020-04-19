import { connect } from "react-redux";
import Header from "../components/Header";
import todosController from "../controllers/todosController";

Header.defaultProps = {
  addTodo: todosController.actions.addTodo
};

export default connect(null, null)(Header);
