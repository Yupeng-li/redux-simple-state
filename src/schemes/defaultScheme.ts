import ld from "lodash";
import { ActionScheme, SelectorScheme, Scheme } from "../types/scheme";
import { AnyAction } from "redux";

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
            if (typeof item === "object")
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
          if (typeof item === "object")
            return Object.assign({}, item, action.value);
          else return action.value;
        });
      }
    },
    {
      name: "deleteItems",
      params: ["query"],
      reducer: (state: any[], action: AnyAction) => {
        if (typeof action.query !== "function")
          throw new TypeError(
            `deleteItem expects a function as the parameter, but it received a ${typeof action.query}`
          );
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

const selector: SelectorScheme = {
  string: {
    name: "get",
    create: (self: any) => {
      return (state: any) => ld.get(state, self.path);
    }
  },
  number: {
    name: "get",
    create: (self: any) => {
      return (state: any) => ld.get(state, self.path);
    }
  },
  boolean: {
    name: "get",
    create: (self: any) => {
      return (state: any) => ld.get(state, self.path);
    }
  },
  object: {
    name: "get",
    create: (self: any) => {
      return (state: any) => ld.get(state, self.path);
    }
  },
  array: {
    name: "get",
    create: (self: any) => {
      return (state: any) => ld.get(state, self.path);
    }
  }
};

const defaultScheme: Scheme = { actions, selector };
export default defaultScheme;
