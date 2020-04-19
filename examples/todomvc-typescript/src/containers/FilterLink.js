import React from "react";
import { connect } from "react-redux";
import Link from "../components/Link";
import todosController from "../controllers/todosController";

const FilterLink = ({ filter, selectedFilter, children, setFilter }) => (
  <Link onClick={() => setFilter(filter)} active={selectedFilter === filter}>
    {children}
  </Link>
);

const mapStateToProps = state => ({
  selectedFilter: todosController.state.visibilityFilter.selector(state)
});

FilterLink.defaultProps = {
  setFilter: todosController.actions.setVisibilityFilter
};

export default connect(mapStateToProps, null)(FilterLink);
