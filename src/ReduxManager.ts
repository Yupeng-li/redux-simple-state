import {
  createStore as reduxCreateStore,
  combineReducers,
  Reducer,
  Store,
  StoreEnhancer,
  CombinedState,
  AnyAction
} from "redux";
import StateContainer from "./StateContainer";
import { LooseObject } from "./types/LooseObject";
import ld from "lodash";
import { Selector } from "reselect";

export const ReservedActionTypes = {
  restState: "_REST_STATE"
};

export class ReduxManager {
  store: Store | null;
  _reducers: LooseObject;
  _topLevelReducer: Reducer;

  constructor() {
    this.store = null;
    this._reducers = {};
    this._topLevelReducer = (state = undefined, action: AnyAction) => {
      if (action.type === ReservedActionTypes.restState) {
        return undefined;
      }
      return state;
    };
  }

  createStore(preloadedState?: any, enhancer?: StoreEnhancer) {
    /*
     * Preserve initial state for not-yet-loaded reducers
     */
    if (ld.isPlainObject(preloadedState)) {
      let keys = Object.keys(preloadedState);
      for (let i = 0; i < keys.length; i++) {
        let placeHolderReducer: any = (state: any = null) => state;
        placeHolderReducer.isPlaceHolder = true;
        this._reducers[keys[i]] = placeHolderReducer;
      }
    }

    this.store = reduxCreateStore(
      this._combineReducers(),
      preloadedState,
      enhancer
    );
    return this.store;
  }

  registerReducer(name: string, reducer: Reducer) {
    if (
      this._reducers[name] !== undefined &&
      !this._reducers[name].isPlaceHolder
    )
      throw new Error(
        `Cannot register the reducer. The state tree already has the key ${name}.`
      );

    this._reducers = { ...this._reducers, [name]: reducer };
    if (this.store) {
      this.store.replaceReducer(this._combineReducers());
    }
  }

  registerState(state: StateContainer) {
    if (state._parent)
      throw new Error(
        "Cannot register the nested state, please use the top level state instead."
      );
    this.registerReducer(state._name, state._reducer);
  }

  dispatch(action: AnyAction) {
    if (!this.store) {
      this._throwNotCreatedError();
    } else {
      return this.store.dispatch(action);
    }
  }

  getState() {
    if (!this.store) {
      this._throwNotCreatedError();
    } else {
      return this.store.getState();
    }
  }

  select(selector: Selector<any, any | undefined>) {
    if (!this.store) {
      this._throwNotCreatedError();
    } else {
      return selector(this.store.getState());
    }
  }

  resetState() {
    if (!this.store) {
      this._throwNotCreatedError();
    } else {
      return this.dispatch({ type: ReservedActionTypes.restState });
    }
  }

  _applyTopLevelReducer(reducer: Reducer) {
    return (state: any | undefined, action: AnyAction) => {
      let rootState = this._topLevelReducer(state, action);
      return reducer(rootState, action);
    };
  }

  _combineReducers() {
    const reducerNames = Object.keys(this._reducers);
    let reducer: (state: any, action: AnyAction) => any = (state: any = {}) =>
      state;
    if (reducerNames.length > 0) {
      reducer = combineReducers(this._reducers);
    }
    return this._applyTopLevelReducer(reducer);
  }

  _throwNotCreatedError() {
    throw new Error("Store is not created yet. Please call createStore first.");
  }
}

const reduxManager = new ReduxManager();
export default reduxManager;
