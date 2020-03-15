import { defaultScheme } from "../../src/schemes";
import StateContainer from "../../src/StateContainer";

describe("defaultScheme of string", () => {
  it("contains one action for string", () => {
    expect(defaultScheme.actions.string.length).toBe(1);
  });

  it("contains set action for string", () => {
    let setAction = defaultScheme.actions.string.find(
      action => action.name === "set"
    );
    expect(setAction).not.toBeNull();
    expect(setAction.name).toBe("set");
    expect(setAction.params.length).toBe(1);
    expect(setAction.params[0]).toBe("value");
    expect(setAction.reducer("oldValue", { type: "", value: "newValue" })).toBe(
      "newValue"
    );
  });

  it("contains a 'get' selector for string", () => {
    const selector = defaultScheme.selectors.string;
    expect(selector.name).toBe("get");
    const self = new StateContainer("id", null);
    const selectorFunc = selector.create(self);
    const state = { id: "2" };
    expect(selectorFunc(state)).toBe("2");
  });
});

describe("defaultScheme of number", () => {
  it("contains one action for number", () => {
    expect(defaultScheme.actions.number.length).toBe(1);
  });

  it("contains set action for number", () => {
    let setAction = defaultScheme.actions.number.find(
      action => action.name === "set"
    );
    expect(setAction).not.toBeNull();
    expect(setAction.name).toBe("set");
    expect(setAction.params.length).toBe(1);
    expect(setAction.params[0]).toBe("value");
    expect(setAction.reducer(0, { type: "", value: 1 })).toBe(1);
  });

  it("contains a 'get' selector for number", () => {
    const selector = defaultScheme.selectors.number;
    expect(selector.name).toBe("get");
    const self = new StateContainer("id", null);
    const selectorFunc = selector.create(self);
    const state = { id: 22 };
    expect(selectorFunc(state)).toBe(22);
  });
});

describe("defaultScheme of boolean", () => {
  it("contains one action for boolean", () => {
    expect(defaultScheme.actions.boolean.length).toBe(1);
  });

  it("contains set action for boolean", () => {
    let setAction = defaultScheme.actions.boolean.find(
      action => action.name === "set"
    );
    expect(setAction).not.toBeNull();
    expect(setAction.name).toBe("set");
    expect(setAction.params.length).toBe(1);
    expect(setAction.params[0]).toBe("value");
    expect(setAction.reducer(false, { type: "", value: true })).toBe(true);
  });

  it("contains a 'get' selector for boolean", () => {
    const selector = defaultScheme.selectors.boolean;
    expect(selector.name).toBe("get");
    const self = new StateContainer("active", null);
    const selectorFunc = selector.create(self);
    const state = { active: true };
    expect(selectorFunc(state)).toBe(true);
  });
});

describe("defaultScheme of object", () => {
  it("contains two actions for object", () => {
    expect(defaultScheme.actions.object.length).toBe(2);
  });

  it("contains set action for object", () => {
    let setAction = defaultScheme.actions.object.find(
      action => action.name === "set"
    );
    expect(setAction).not.toBeNull();
    expect(setAction.name).toBe("set");
    expect(setAction.params.length).toBe(1);
    expect(setAction.params[0]).toBe("value");
    expect(setAction.reducer({}, { type: "", value: null })).toBeNull();
    expect(setAction.reducer({}, { type: "", value: { id: "2" } })).toEqual({
      id: "2"
    });
  });

  it("contains update action for object", () => {
    let updateAction = defaultScheme.actions.object.find(
      action => action.name === "update"
    );
    expect(updateAction).not.toBeNull();
    expect(updateAction.name).toBe("update");
    expect(updateAction.params.length).toBe(1);
    expect(updateAction.params[0]).toBe("value");
    expect(
      updateAction.reducer({ id: "2", Name: "John" }, { type: "", value: null })
    ).toEqual({ id: "2", Name: "John" });
    expect(
      updateAction.reducer(
        { id: "2", Name: "John" },
        { type: "", value: { id: "1" } }
      )
    ).toEqual({
      id: "1",
      Name: "John"
    });
  });

  it("The update action returns a new object", () => {
    let updateAction = defaultScheme.actions.object.find(
      action => action.name === "update"
    );
    const oldState = { id: "2", Name: "John" };
    const newState = updateAction.reducer(oldState, {
      type: "",
      value: { id: "1" }
    });
    expect(newState).toEqual({
      id: "1",
      Name: "John"
    });
    expect(oldState).toEqual({ id: "2", Name: "John" });
    expect(oldState).not.toBe(newState);
  });

  it("contains a 'get' selector for object", () => {
    const selector = defaultScheme.selectors.object;
    expect(selector.name).toBe("get");
    const self = new StateContainer("user", null);
    const selectorFunc = selector.create(self);
    const state = { user: { id: "2", active: true } };
    expect(selectorFunc(state)).toEqual({ id: "2", active: true });
  });
});

describe("defaultScheme of array", () => {
  it("contains six actions for array", () => {
    expect(defaultScheme.actions.array.length).toBe(6);
  });

  it("contains set action for array", () => {
    let setAction = defaultScheme.actions.array.find(
      action => action.name === "set"
    );
    expect(setAction).not.toBeNull();
    expect(setAction.name).toBe("set");
    expect(setAction.params.length).toBe(1);
    expect(setAction.params[0]).toBe("value");
    expect(setAction.reducer([], { type: "", value: [1, 2] })).toEqual([1, 2]);
  });

  it("The set action returns a new array", () => {
    let setAction = defaultScheme.actions.array.find(
      action => action.name === "set"
    );
    const oldState = [1, 2];
    const newValue = ["a", "b"];
    const newState = setAction.reducer(oldState, { type: "", value: newValue });
    expect(newState).toBe(newValue);
    expect(oldState).toEqual([1, 2]);
    expect(oldState).not.toBe(newState);
  });

  it("contains updateItems action for array", () => {
    let updateItemsAction = defaultScheme.actions.array.find(
      action => action.name === "updateItems"
    );
    expect(updateItemsAction).not.toBeNull();
    expect(updateItemsAction.name).toBe("updateItems");
    expect(updateItemsAction.params.length).toBe(2);
    expect(updateItemsAction.params[0]).toBe("query");
    expect(updateItemsAction.params[1]).toBe("value");
    expect(
      updateItemsAction.reducer([1, 2], {
        type: "",
        query: item => item === 2,
        value: 5
      })
    ).toEqual([1, 5]);

    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [{ id: "1" }, { id: "2", name: "John" }];
    expect(
      updateItemsAction.reducer(oldState, {
        type: "",
        query: item => item.id === "2",
        value: { id: "2", name: "John" }
      })
    ).toEqual(expectedState);
  });

  it("The updateItems action returns a new array", () => {
    let updateItemsAction = defaultScheme.actions.array.find(
      action => action.name === "updateItems"
    );
    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [{ id: "1" }, { id: "2", name: "John" }];
    const newState = updateItemsAction.reducer(oldState, {
      type: "",
      query: item => item.id === "2",
      value: { name: "John" }
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
    expect(oldState[1]).not.toBe(newState[1]);
  });

  it("The updateItems action can update multiple values in the array", () => {
    let updateItemsAction = defaultScheme.actions.array.find(
      action => action.name === "updateItems"
    );
    const oldState = [
      { id: "1", active: true },
      { id: "2", active: true }
    ];
    const expectedState = [
      { id: "1", active: false },
      { id: "2", active: false }
    ];
    const newState = updateItemsAction.reducer(oldState, {
      type: "",
      query: item => item.active,
      value: { active: false }
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
  });

  //TODO  test different type of arrays.

  it("contains updateAll action for array", () => {
    let updateAllAction = defaultScheme.actions.array.find(
      action => action.name === "updateAll"
    );
    expect(updateAllAction).not.toBeNull();
    expect(updateAllAction.name).toBe("updateAll");
    expect(updateAllAction.params.length).toBe(1);
    expect(updateAllAction.params[0]).toBe("value");
    expect(
      updateAllAction.reducer([1, 2], {
        type: "",
        value: 5
      })
    ).toEqual([5, 5]);

    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [
      { id: "1", active: false },
      { id: "2", active: false }
    ];
    expect(
      updateAllAction.reducer(oldState, {
        type: "",
        value: { active: false }
      })
    ).toEqual(expectedState);
  });

  it("The updateAll action returns a new array", () => {
    let updateAllAction = defaultScheme.actions.array.find(
      action => action.name === "updateAll"
    );
    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [
      { id: "1", active: false },
      { id: "2", active: false }
    ];
    const newState = updateAllAction.reducer(oldState, {
      type: "",
      value: { active: false }
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
    expect(oldState[0]).not.toBe(newState[0]);
    expect(oldState[1]).not.toBe(newState[1]);
  });

  it("contains deleteItems action for array", () => {
    let deleteItemsAction = defaultScheme.actions.array.find(
      action => action.name === "deleteItems"
    );
    expect(deleteItemsAction).not.toBeNull();
    expect(deleteItemsAction.name).toBe("deleteItems");
    expect(deleteItemsAction.params.length).toBe(1);
    expect(deleteItemsAction.params[0]).toBe("query");
    expect(
      deleteItemsAction.reducer([1, 2, 2, 3], {
        type: "",
        query: item => item === 2
      })
    ).toEqual([1, 3]);

    const oldState = [
      { id: "1", active: false },
      { id: "2", active: false },
      { id: "3", active: true }
    ];
    const expectedState = [{ id: "3", active: true }];
    expect(
      deleteItemsAction.reducer(oldState, {
        type: "",
        query: item => item.active === false
      })
    ).toEqual(expectedState);
  });

  it("The deleteItems action returns a new array", () => {
    let deleteItemsAction = defaultScheme.actions.array.find(
      action => action.name === "deleteItems"
    );
    const oldState = [
      { id: "1", active: false },
      { id: "2", active: false },
      { id: "3", active: true }
    ];
    const expectedState = [{ id: "3", active: true }];
    const newState = deleteItemsAction.reducer(oldState, {
      type: "",
      query: item => item.active === false
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
  });

  it("contains deleteAll action for array", () => {
    let deleteAllAction = defaultScheme.actions.array.find(
      action => action.name === "deleteAll"
    );
    expect(deleteAllAction).not.toBeNull();
    expect(deleteAllAction.name).toBe("deleteAll");
    expect(deleteAllAction.params.length).toBe(0);
    expect(
      deleteAllAction.reducer([1, 2, 3], {
        type: ""
      })
    ).toEqual([]);

    const oldState = [
      { id: "1", active: false },
      { id: "2", active: false },
      { id: "3", active: true }
    ];
    const expectedState = [];
    expect(
      deleteAllAction.reducer(oldState, {
        type: ""
      })
    ).toEqual(expectedState);
  });

  it("The deleteAll action returns a new array", () => {
    let deleteAllAction = defaultScheme.actions.array.find(
      action => action.name === "deleteAll"
    );
    const oldState = [
      { id: "1", active: false },
      { id: "2", active: false },
      { id: "3", active: true }
    ];
    const expectedState = [];
    const newState = deleteAllAction.reducer(oldState, {
      type: "",
      query: item => item.active === false
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
  });

  it("contains addItem action for array", () => {
    let addItemAction = defaultScheme.actions.array.find(
      action => action.name === "addItem"
    );
    expect(addItemAction).not.toBeNull();
    expect(addItemAction.name).toBe("addItem");
    expect(addItemAction.params.length).toBe(1);
    expect(addItemAction.params[0]).toBe("item");
    expect(
      addItemAction.reducer([1, 2], {
        type: "",
        item: 5
      })
    ).toEqual([1, 2, 5]);

    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [{ id: "1" }, { id: "2" }, { id: "3" }];
    expect(
      addItemAction.reducer(oldState, {
        type: "",
        item: { id: "3" }
      })
    ).toEqual(expectedState);
  });

  it("The addItem action returns a new array", () => {
    let addItemAction = defaultScheme.actions.array.find(
      action => action.name === "addItem"
    );
    const oldState = [{ id: "1" }, { id: "2" }];
    const expectedState = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const newState = addItemAction.reducer(oldState, {
      type: "",
      item: { id: "3" }
    });

    expect(newState).toEqual(expectedState);
    expect(oldState).not.toBe(newState);
  });

  it("contains a 'get' selector for array", () => {
    const selector = defaultScheme.selectors.array;
    expect(selector.name).toBe("get");
    const self = new StateContainer("users", null);
    const selectorFunc = selector.create(self);
    const state = {
      users: [
        { id: "1", active: false },
        { id: "2", active: true }
      ]
    };
    expect(selectorFunc(state)).toEqual([
      { id: "1", active: false },
      { id: "2", active: true }
    ]);
  });
});
