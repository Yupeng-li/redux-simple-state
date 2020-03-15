import createState from "../src/createState";
import StateContainer from "../src/StateContainer";

describe("createState", () => {
  it("throws error when initial value is undefined", () => {
    expect(() => createState("myState", undefined)).toThrow(
      "The initialValue is invalid. It has to be a string, number, boolean, array, object or null."
    );
  });

  it("can create a state with a string as initial value", () => {
    let state = createState("myState", "JavaScript");
    expect(state instanceof StateContainer).toBeTruthy();
    expect(state).toBeTruthy();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.resetToDefault).toBe("function");
    expect(typeof state.selector).toBe("function");
    expect(state._path).toBe("myState");
    expect(state._name).toBe("myState");
    expect(state._initialValue).toBe("JavaScript");
    expect(() => state.get()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.set("")).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.resetToDefault()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("can create a state with a number as initial value", () => {
    let state = createState("myState", 1);
    expect(state instanceof StateContainer).toBeTruthy();
    expect(state).toBeTruthy();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.resetToDefault).toBe("function");
    expect(typeof state.selector).toBe("function");
    expect(state._path).toBe("myState");
    expect(state._name).toBe("myState");
    expect(state._initialValue).toBe(1);
    expect(() => state.get()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.set(1)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.resetToDefault()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("can create a state with a boolean as initial value", () => {
    let state = createState("myState", true);
    expect(state).toBeTruthy();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.resetToDefault).toBe("function");
    expect(typeof state.selector).toBe("function");
    expect(state._path).toBe("myState");
    expect(state._name).toBe("myState");
    expect(state._initialValue).toBe(true);
    expect(() => state.get()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.set(false)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.resetToDefault()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("can create a state with an object as initial value", () => {
    let state = createState("myState", {});
    expect(state).toBeTruthy();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.update).toBe("function");
    expect(typeof state.resetToDefault).toBe("function");
    expect(typeof state.selector).toBe("function");
    expect(state._path).toBe("myState");
    expect(state._name).toBe("myState");
    expect(state._initialValue).toEqual({});
    expect(() => state.get()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.set({})).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.update({ id: 1 })).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.resetToDefault()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("can create a state with an array as initial value", () => {
    let state = createState("myState", []);
    expect(state).toBeTruthy();
    expect(typeof state.get).toBe("function");
    expect(typeof state.set).toBe("function");
    expect(typeof state.addItem).toBe("function");
    expect(typeof state.updateItems).toBe("function");
    expect(typeof state.deleteItems).toBe("function");
    expect(typeof state.updateAll).toBe("function");
    expect(typeof state.deleteAll).toBe("function");
    expect(typeof state.resetToDefault).toBe("function");
    expect(typeof state.selector).toBe("function");
    expect(state._path).toBe("myState");
    expect(state._name).toBe("myState");
    expect(state._initialValue).toEqual([]);
    expect(() => state.get()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.set([])).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.addItem(1)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.updateItems(item => true, 1)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.deleteItems(item => true)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.updateAll(1)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.deleteAll()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
    expect(() => state.resetToDefault()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("creates a child StateContainer for the string field in the initial object.", () => {
    let state = createState("myState", {
      name: "testString"
    });
    let substate = state.name;
    expect(substate instanceof StateContainer).toBeTruthy();
    expect(substate).toBeTruthy();
    expect(typeof substate.get).toBe("function");
    expect(typeof substate.set).toBe("function");
    expect(typeof substate.resetToDefault).toBe("function");
    expect(typeof substate.selector).toBe("function");
    expect(substate._path).toBe("myState.name");
    expect(substate._name).toBe("name");
    expect(substate._initialValue).toBe("testString");
  });

  it("creates a child StateContainer for the number field in the initial object.", () => {
    let state = createState("myState", {
      name: "testString"
    });
    let substate = state.name;
    expect(substate instanceof StateContainer).toBeTruthy();
    expect(substate).toBeTruthy();
    expect(typeof substate.get).toBe("function");
    expect(typeof substate.set).toBe("function");
    expect(typeof substate.resetToDefault).toBe("function");
    expect(typeof substate.selector).toBe("function");
    expect(substate._path).toBe("myState.name");
    expect(substate._name).toBe("name");
    expect(substate._initialValue).toBe("testString");
  });

  //TODO add tests for all types
});
