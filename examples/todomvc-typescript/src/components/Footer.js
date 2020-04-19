import React from "react";
import PropTypes from "prop-types";
import { TodosFilter } from "../types/todos";
import FilterLink from "containers/FilterLink";

const FILTER_TITLES = {
  [TodosFilter.SHOW_ALL]: "All",
  [TodosFilter.SHOW_ACTIVE]: "Active",
  [TodosFilter.SHOW_COMPLETED]: "Completed"
};

const Footer = props => {
  const { activeCount, completedCount, onClearCompleted } = props;
  const itemWord = activeCount === 1 ? "item" : "items";
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || "No"}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter => (
          <li key={filter}>
            <FilterLink filter={filter}>{FILTER_TITLES[filter]}</FilterLink>
          </li>
        ))}
      </ul>
      {!!completedCount && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired
};

export default Footer;
