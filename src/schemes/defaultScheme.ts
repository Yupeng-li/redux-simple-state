import ld from "lodash";
import { ActionScheme, SelectorScheme, Scheme } from "../types/scheme";
import { AnyAction } from "redux";
import StateContainer from "../StateContainer";

const actions: ActionScheme = {
  string: [
    {
      name: "set",
      params: ["value"],
      reducer: (state: string, action: AnyAction) => action.value
    }
  ],
  number: [
    {
      name: "set",
      params: ["value"],
      reducer: (state: number, action: AnyAction) => action.value
    }
  ],
  boolean: [
    {
      name: "set",
      params: ["value"],
      reducer: (state: boolean, action: AnyAction) => action.value
    }
  ],
  object: [
    {
      name: "set",
      params: ["value"],
      reducer: (state: object, action: AnyAction) => action.value
    },
    {
      name: "update",
      params: ["value"],
      reducer: (state: object, action: AnyAction) =>
        Object.assign({}, state, action.value)
    }
  ],
  array: [
    {
      name: "set",
      params: ["value"],
      reducer: (state: any[], action: AnyAction) => action.value
    },
    {
      name: "updateItems",
      params: ["query", "value"],
      reducer: (state: any[], action: AnyAction) => {
        return state.map(item => {
          if (action.query(item)) {
            if (ld.isPlainObject(item) && ld.isPlainObject(action.value))
              return Object.assign({}, item, action.value);
            else return action.value;
          }
          return item;
        });
      }
    },
    {
      name: "updateAll",
      params: ["value"],
      reducer: (state: any[], action: AnyAction) => {
        return state.map(item => {
          if (ld.isPlainObject(item) && ld.isPlainObject(action.value))
            return Object.assign({}, item, action.value);
          else return action.value;
        });
      }
    },
    {
      name: "deleteItems",
      params: ["query"],
      reducer: (state: any[], action: AnyAction) => {
        return state.filter(item => !action.query(item));
      }
    },
    {
      name: "deleteAll",
      params: [],
      reducer: (state: any[], action: AnyAction) => {
        return [];
      }
    },
    {
      name: "addItem",
      params: ["item"],
      reducer: (state: any[], action: AnyAction) => {
        return [...state, action.item];
      }
    }
  ]
};

const selectors: SelectorScheme = {
  string: {
    name: "get",
    create: (self: StateContainer) => {
      return (state: any) => ld.get(state, self._path);
    }
  },
  number: {
    name: "get",
    create: (self: StateContainer) => {
      return (state: any) => ld.get(state, self._path);
    }
  },
  boolean: {
    name: "get",
    create: (self: StateContainer) => {
      return (state: any) => ld.get(state, self._path);
    }
  },
  object: {
    name: "get",
    create: (self: StateContainer) => {
      return (state: any) => ld.get(state, self._path);
    }
  },
  array: {
    name: "get",
    create: (self: StateContainer) => {
      return (state: any) => ld.get(state, self._path);
    }
  }
};

const defaultScheme: Scheme = { actions, selectors };
export default defaultScheme;
