import ld from "lodash";
import {combineReducers} from "redux";

export default class StateContainer {
    constructor(name, initialValue) {
        this.name = name;
        this.initialValue = initialValue;
        this.parent = null;
        this.children = [];
        this.selector = null;
    }

    get path() {
        if (this.parent) {
            return this.parent.path.concat(".", this.name);
        } else {
            return this.name;
        }
    }

    get reducer() {
        const self = this;
        let reducerMap = self.actions.reduce((map, action) => {
            let actionType = self.path.concat(".", action.name);
            map[actionType] = action.reducer;
            return map;
        }, {});
        let subReducerMap = self.children.reduce((subReducer, child) => {
            subReducer[child.name] = child.reducer;
            return subReducer;
        }, {});
        let subReducer = ld.isEmpty(subReducerMap) ? null : combineReducers(subReducerMap);
        return (state = self.initialValue, action) => {
            let reducer = reducerMap[action.type];
            if (reducer) {
                return reducer(state, action);
            } else if (subReducer) {
                return subReducer(state, action);
            } else
                return state;
        }
    }
}