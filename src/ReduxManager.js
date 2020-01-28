import {createStore as reduxCreateStore, combineReducers} from 'redux';
import StateContainer from "./StateContainer";

class ReduxManager {
    constructor() {
        this.store = null;
        this._reducers = {};
        this._preloadedState = null;
    }

    createStore(preloadedState, enhancer) {
        const reducer  = (state = null) => state;
        this.store = reduxCreateStore(reducer, preloadedState, enhancer);
        this._preloadedState = preloadedState;
        if(this._reducers && Object.keys(this._reducers).length)
            this.store.replaceReducer(this._combineReducers(this._reducers));
        return this.store;
    }

    register(name, reducer) {
        if(this._reducers[name]!==undefined)
            throw new Error(`The root store already has the key ${name}.`);
        this._reducers = {...this._reducers, [name]: reducer};
        if (this.store) {
            this.store.replaceReducer(this._combineReducers(this._reducers));
        }
    }

    registerState(state)
    {
        let {name, reducer}=state;
        if(!state instanceof StateContainer)
            throw new Error("state has to be an instance of StateContainer");
        if(state.parent)
            throw new Error("state has to be the root");

        this.register(state.name, state.reducer);
    }

    dispatch(action) {
        if (!this.store)
            this._throwNotCreatedError();
        return this.store.dispatch(action);
    }

    getState() {
        if (!this.store)
            this._throwNotCreatedError();

        return this.store.getState();
    }

    /*
    * Preserve initial state for not-yet-loaded reducers
    */
    _combineReducers() {
        const reducerNames = Object.keys(this._reducers);
        Object.keys(this._preloadedState).forEach(item => {
            if (reducerNames.indexOf(item) === -1) {
                this._reducers[item] = (state = null) => state;
            }
        });
        return combineReducers(this._reducers);
    }

    _throwNotCreatedError() {
        throw new Error(
            'Store is not created yet. Please call createStore first.');
    }
}

const reduxManager = new ReduxManager();

export default reduxManager;
