import { AnyAction } from "redux";
import { Selector } from "reselect";

export type ActionConfig = {
  name: string;
  params: Array<string>;
  reducer: (state: any | undefined, action: AnyAction) => any;
};

export type ActionScheme = {
  string: ActionConfig[];
  number: ActionConfig[];
  boolean: ActionConfig[];
  object: ActionConfig[];
  array: ActionConfig[];
};

export type SelectorConfig = {
  name: string;
  create: (self: any) => Selector<any, any | undefined>;
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
  selector: SelectorScheme;
};
