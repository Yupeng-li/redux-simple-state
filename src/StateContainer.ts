import ld from "lodash";
import { combineReducers } from "redux";
import { ActionConfig } from "./types/scheme";
import { LooseObject } from "./types/LooseObject";
import { AnyAction, Reducer } from "redux";

export default class StateContainer implements LooseObject {
  name: string;
  initialValue: any | undefined;
  parent: StateContainer | null;
  children: Array<StateContainer>;
  selector: ((state: any) => any | undefined) | null;
  actions: Array<ActionConfig<any>>;
  [extraProps: string]: any;

  constructor(name: string, initialValue: any | undefined) {
    this.name = name;
    this.initialValue = initialValue;
    this.parent = null;
    this.children = [];
    this.selector = null;
    this.actions = [];
  }

  get path(): string {
    if (this.parent) {
      return this.parent.path.concat(".", this.name);
    } else {
      return this.name;
    }
  }

  get reducer(): Reducer {
    const self = this;
    let reducerMap = self.actions.reduce((map: LooseObject, action) => {
      let actionType = self.path.concat(".", action.name);
      map[actionType] = action.reducer;
      return map;
    }, {});
    let subReducerMap = self.children.reduce(
      (subReducer: LooseObject, child) => {
        subReducer[child.name] = child.reducer;
        return subReducer;
      },
      {}
    );
    let subReducer = ld.isEmpty(subReducerMap)
      ? null
      : combineReducers(subReducerMap);

    return (state = self.initialValue, action: AnyAction) => {
      let reducer = reducerMap[action.type];
      if (reducer) {
        return reducer(state, action);
      } else if (subReducer) {
        return subReducer(state, action);
      } else return state;
    };
  }
}
