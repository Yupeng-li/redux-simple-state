import {
  createStore as reduxCreateStore,
  combineReducers,
  Reducer,
  Store,
  StoreEnhancer,
  AnyAction
} from "redux";
import StateContainer from "./StateContainer";
import { LooseObject } from "./types/LooseObject";
import ld from "lodash";

export class ReduxManager {
  public store: Store | null;
  private _reducers: LooseObject;

  constructor() {
    this.store = null;
    this._reducers = {};
  }

  createStore(preloadedState?: any, enhancer?: StoreEnhancer) {
    /*
     * Preserve initial state for not-yet-loaded reducers
     */
    if (ld.isObject(preloadedState)) {
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
    if (state.parent)
      throw new Error(
        "Cannot register the nested state, please use the top level state instead."
      );
    this.registerReducer(state.name, state.reducer);
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

  _combineReducers() {
    const reducerNames = Object.keys(this._reducers);
    if (reducerNames.length > 0) {
      return combineReducers(this._reducers);
    } else {
      /* Default root reducer */
      return (state: any = {}) => state;
    }
  }

  _throwNotCreatedError() {
    throw new Error("Store is not created yet. Please call createStore first.");
  }
}
