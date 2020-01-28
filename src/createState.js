import ld from 'lodash';
import StateContainer from "./StateContainer";
import {defaultScheme} from './schemes';
import ReduxManager from './ReduxManager';

export default function createState(name, initialValue, schema = defaultScheme) {
    let state = new StateContainer(name, initialValue);
    const {actions, selector} = schema;
    let type;
    if (ld.isString(initialValue)) {
        type = "string";
    } else if (ld.isArray(initialValue)) {
        type = "array";
    } else if (ld.isNumber(initialValue)) {
        type = "number";
    } else if (ld.isBoolean(initialValue)) {
        type = "boolean";
    } else if (initialValue === null || ld.isPlainObject(initialValue)) {
        type = "object";
    } else {
        throw new Error("initialValue is invalid. It has to be string, number, boolean, array, object or null.")
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
                state.initialValue[key]= child.initialValue;
            } else {
                let child = createState(key, value, schema);
                child.parent = state;
                state[key] = child;
                state.children.push(child);
            }
        }
    }

    mapActionsToState(state, actions[type]);
    mapSelectorToState(state, selector[type]);
    return state;
}

function mapActionsToState(state, actions) {
    state.actions = actions;
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        let params = action.params;

        if (!params) {
            state[action.name] = () => {
                let actionType = state.path.concat(".", action.name);
                ReduxManager.dispatch({type: actionType});
            };
        } else if (typeof params === "string") {
            state[action.name] = value => {
                let actionType = state.path.concat(".", action.name);
                ReduxManager.dispatch({type: actionType, [params]: value});
            };
        } else if (Array.isArray(params)) {
            state[action.name] = (...values) => {
                let actionType = state.path.concat(".", action.name);
                ReduxManager.dispatch({type: actionType, ...ld.zipObject(params, values)});
            };
        } else {
            let actionType = state.path.concat(".", action.name);
            throw new TypeError(`Params of the action ${actionType} has to be a string or an array of strings`);
        }
    }
    state["resetToDefault"] = ()=>{
        state.set(state.initialValue);
    }
}

function mapSelectorToState(state, selector) {
    state[selector.name] = (...args) => {
        return selector.create(state, ...args)(ReduxManager.getState());
    };

    state.selector = selector.create(state);
}


