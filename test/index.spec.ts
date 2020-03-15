import { ReduxManager, createState } from "../src";
import { ReduxManager as RM } from "../src/ReduxManager";
import { Store } from "redux";

describe("Check exports", () => {
  it("ReduxManager is an instance of class ReduxManager", () => {
    expect(ReduxManager instanceof RM).toBe(true);
  });
});

describe("String type state", () => {
  beforeEach(() => {
    /* Reset the ReduxManger */
    ReduxManager.store = null;
    ReduxManager._reducers = {};
    ReduxManager.createStore();
  });

  it("can get the value", () => {
    let myState = createState("myState", "JavaScript");
    ReduxManager.registerState(myState);
    expect(myState.get()).toBe("JavaScript");
  });

  it("can set the value", () => {
    let myState = createState("myState", "JavaScript");
    ReduxManager.registerState(myState);
    expect(myState.set("JSON")).toEqual({ type: "myState.set", value: "JSON" });
    expect(myState.get()).toBe("JSON");
  });

  it("has a selector", () => {
    let myState = createState("myState", "JavaScript");
    ReduxManager.registerState(myState);
    let state = ReduxManager.getState();
    expect(myState.selector(state)).toBe("JavaScript");
  });
});

describe("Number type state", () => {
  beforeEach(() => {
    /* Reset the ReduxManger */
    ReduxManager.store = null;
    ReduxManager._reducers = {};
    ReduxManager.createStore();
  });

  it("can get the value", () => {
    let myState = createState("myState", 1);
    ReduxManager.registerState(myState);
    expect(myState.get()).toBe(1);
  });

  it("can set the value", () => {
    let myState = createState("myState", 1);
    ReduxManager.registerState(myState);
    expect(myState.set(2)).toEqual({ type: "myState.set", value: 2 });
    expect(myState.get()).toBe(2);
  });

  it("has a selector", () => {
    let myState = createState("myState", 1);
    ReduxManager.registerState(myState);
    let state = ReduxManager.getState();
    expect(myState.selector(state)).toBe(1);
  });
});

describe("Boolean type state", () => {
  beforeEach(() => {
    /* Reset the ReduxManger */
    ReduxManager.store = null;
    ReduxManager._reducers = {};
    ReduxManager.createStore();
  });

  it("can get the value", () => {
    let myState = createState("myState", true);
    ReduxManager.registerState(myState);
    expect(myState.get()).toBe(true);
  });

  it("can set the value", () => {
    let myState = createState("myState", true);
    ReduxManager.registerState(myState);
    expect(myState.set(false)).toEqual({ type: "myState.set", value: false });
    expect(myState.get()).toBe(false);
  });

  it("has a selector", () => {
    let myState = createState("myState", true);
    ReduxManager.registerState(myState);
    let state = ReduxManager.getState();
    expect(myState.selector(state)).toBe(true);
  });
});

describe("Array type state", () => {
  beforeEach(() => {
    /* Reset the ReduxManger */
    ReduxManager.store = null;
    ReduxManager._reducers = {};
    ReduxManager.createStore();
  });

  it("can get the value", () => {
    const initialValue = [1, 2, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    expect(myState.get()).toEqual(initialValue);
  });

  it("can set the value", () => {
    const initialValue = [1, 2, 3];
    const newValue = ["a", "b"];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    expect(myState.get()).toEqual(initialValue);
    expect(myState.set(newValue)).toEqual({
      type: "myState.set",
      value: newValue
    });
    expect(myState.get()).toEqual(newValue);
  });

  it("has a selector", () => {
    const initialValue = [1, 2, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    let state = ReduxManager.getState();
    expect(myState.selector(state)).toBe(initialValue);
  });

  it("can add a new item to the array", () => {
    const initialValue = [1, 2, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    myState.addItem(4);
    expect(myState.get()).not.toBe(initialValue);
    expect(myState.get()).toEqual([1, 2, 3, 4]);
  });

  it("can add an object as a new item to the array", () => {
    const initialValue = [1, 2, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    myState.addItem({ id: 1 });
    expect(myState.get()).not.toBe(initialValue);
    expect(myState.get()).toEqual([1, 2, 3, { id: 1 }]);
  });

  it("can update an item in the array", () => {
    const initialValue = [1, 2, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    myState.updateItems(item => item === 3, 4);
    expect(myState.get()).not.toBe(initialValue);
    expect(myState.get()).toEqual([1, 2, 4]);
  });

  it("can update an object item in the array", () => {
    const initialValue = [1, 2, 3, { id: 1, name: "John" }];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    myState.updateItems(item => item.id === 1, { id: 2 });
    expect(myState.get()).not.toBe(initialValue);
    expect(myState.get()).toEqual([1, 2, 3, { id: 2, name: "John" }]);
    expect(myState.get()[3]).not.toBe(initialValue[3]);
  });

  it("can update multiple items in the array", () => {
    const initialValue = [1, 2, 3, 3];
    let myState = createState("myState", initialValue);
    ReduxManager.registerState(myState);
    myState.updateItems(item => item === 3, 4);
    expect(myState.get()).not.toBe(initialValue);
    expect(myState.get()).toEqual([1, 2, 4, 4]);
  });
  //TODO test the different type of array
});
