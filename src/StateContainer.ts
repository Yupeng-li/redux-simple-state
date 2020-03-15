import ld from "lodash";
import { combineReducers } from "redux";
import { ActionConfig } from "./types/scheme";
import { LooseObject } from "./types/LooseObject";
import { AnyAction, Reducer } from "redux";

export default class StateContainer implements LooseObject {
  _name: string;
  _initialValue: any | undefined;
  _parent: StateContainer | null;
  _children: Array<StateContainer>;
  _actions: Array<ActionConfig<any>>;
  selector: ((state: any) => any | undefined) | null;

  [extraProps: string]: any;

  constructor(name: string, initialValue: any) {
    this._name = name;
    this._initialValue = initialValue;
    this._parent = null;
    this._children = [];
    this.selector = null;
    this._actions = [];
  }

  get _path(): string {
    if (this._parent) {
      return this._parent._path.concat(".", this._name);
    } else {
      return this._name;
    }
  }

  get _reducer(): Reducer {
    const self = this;
    let reducerMap = self._actions.reduce((map: LooseObject, action) => {
      let actionType = self._path.concat(".", action.name);
      map[actionType] = action.reducer;
      return map;
    }, {});
    let subReducerMap = self._children.reduce(
      (subReducer: LooseObject, child) => {
        subReducer[child._name] = child._reducer;
        return subReducer;
      },
      {}
    );
    let subReducer = ld.isEmpty(subReducerMap)
      ? null
      : combineReducers(subReducerMap);

    return (state = self._initialValue, action: AnyAction) => {
      let reducer = reducerMap[action.type];
      if (reducer) {
        return reducer(state, action);
      } else if (subReducer) {
        return subReducer(state, action);
      } else return state;
    };
  }
}
