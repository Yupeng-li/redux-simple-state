export interface ITodo {
  id: number;
  text: string;
  completed: boolean;
}

export enum TodosFilter {
  SHOW_ALL = "SHOW_ALL",
  SHOW_ACTIVE = "SHOW_ACTIVE",
  SHOW_COMPLETED = "SHOW_COMPLETED"
}
