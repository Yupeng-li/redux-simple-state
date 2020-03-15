import { AnyAction } from "redux";
import { Selector } from "reselect";
import StateContainer from "../StateContainer";

export type ActionConfig<T> = {
  name: string;
  params: Array<string>;
  reducer: (state: T, action: AnyAction) => T;
};

export type ActionScheme = {
  string: ActionConfig<string>[];
  number: ActionConfig<number>[];
  boolean: ActionConfig<boolean>[];
  object: ActionConfig<object>[];
  array: ActionConfig<any[]>[];
};

export type SelectorConfig = {
  name: string;
  create: (self: StateContainer) => Selector<any, any | undefined>;
};

export type SelectorScheme = {
  string: SelectorConfig;
  number: SelectorConfig;
  boolean: SelectorConfig;
  object: SelectorConfig;
  array: SelectorConfig;
};

export type Scheme = {
  actions: ActionScheme;
  selectors: SelectorScheme;
};
