import ld from "lodash";
import StateContainer from "./StateContainer";
import { defaultScheme } from "./schemes";
import { ReduxManager } from "../src";
import { ActionConfig, SelectorConfig } from "./types/scheme";

export default function createState(
  name: string,
  initialValue: any,
  schema = defaultScheme
) {
  let state = new StateContainer(name, initialValue);
  const { actions, selectors } = schema;
  let actionConfigList;
  let selectorConfig;
  if (ld.isString(initialValue)) {
    actionConfigList = actions.string;
    selectorConfig = selectors.string;
  } else if (ld.isArray(initialValue)) {
    actionConfigList = actions.array;
    selectorConfig = selectors.array;
  } else if (ld.isNumber(initialValue)) {
    actionConfigList = actions.number;
    selectorConfig = selectors.number;
  } else if (ld.isBoolean(initialValue)) {
    actionConfigList = actions.boolean;
    selectorConfig = selectors.boolean;
  } else if (initialValue === null || ld.isPlainObject(initialValue)) {
    actionConfigList = actions.object;
    selectorConfig = selectors.object;
  } else {
    throw new Error(
      "initialValue is invalid. It has to be string, number, boolean, array, object or null."
    );
  }

  if (ld.isPlainObject(initialValue)) {
    let keys = Object.keys(initialValue);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];

      let value = initialValue[key];
      if (value instanceof StateContainer) {
        let child = value;
        child.name = key;
        child.parent = state;
        state[key] = child;
        state.children.push(child);
        state.initialValue[key] = child.initialValue;
      } else {
        let child = createState(key, value, schema);
        child.parent = state;
        state[key] = child;
        state.children.push(child);
      }
    }
  }

  mapActionsToState(state, actionConfigList);
  mapSelectorToState(state, selectorConfig);
  return state;
}

function mapActionsToState(
  state: StateContainer,
  actions: Array<ActionConfig<any>>
) {
  state.actions = actions;
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    let params = action.params;

    if (!params) {
      state[action.name] = () => {
        let actionType = state.path.concat(".", action.name);
        ReduxManager.dispatch({ type: actionType });
      };
    } else if (ld.isArray(params)) {
      state[action.name] = (...values: Array<any>) => {
        let actionType = state.path.concat(".", action.name);
        ReduxManager.dispatch({
          type: actionType,
          ...ld.zipObject(params, values)
        });
      };
    } else {
      let actionType = state.path.concat(".", action.name);
      throw new TypeError(
        `Params of the action ${actionType} has to be a string or an array of strings`
      );
    }
  }
  state["resetToDefault"] = () => {
    state.set(state.initialValue);
  };
}

function mapSelectorToState(state: StateContainer, selector: SelectorConfig) {
  state[selector.name] = () => {
    return selector.create(state)(ReduxManager.getState());
  };

  state.selector = selector.create(state);
}
