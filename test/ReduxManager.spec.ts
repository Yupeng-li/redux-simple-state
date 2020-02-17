import { ReduxManager } from "../src/ReduxManager";
import createState from "../src/createState";
import { AnyAction } from "redux";

describe("ReduxManager", () => {
  it("can create a store", () => {
    const rm = new ReduxManager();
    let store = rm.createStore();
    expect(store.getState()).toEqual({});
  });

  it("can create a store with preloaded state", () => {
    const rm = new ReduxManager();
    const preloadedState = { user: { id: 1 } };
    let store = rm.createStore(preloadedState);
    expect(store.getState()).toEqual(preloadedState);
  });

  it("getState() returns the state", () => {
    const rm = new ReduxManager();
    const preloadedState = { user: { id: 1 } };
    let store = rm.createStore(preloadedState);
    expect(rm.getState()).toEqual(preloadedState);
    expect(rm.getState()).toEqual(store.getState());
  });

  it("getState() throws error when store is not initialised", () => {
    const rm = new ReduxManager();
    expect(() => rm.getState()).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("can dispatch an action", () => {
    const rm = new ReduxManager();
    const preloadedState = { user: { id: 1 } };
    let store = rm.createStore(preloadedState);
    let action = { type: "test_action_type", payload: { user: { id: 2 } } };
    let mockedDispatch = jest.fn(a => a);
    store.dispatch = mockedDispatch;
    expect(rm.dispatch(action)).toEqual(action);
    expect(mockedDispatch.mock.calls.length).toBe(1);
    expect(mockedDispatch.mock.calls[0][0]).toEqual(action);
  });

  it("dispatch() throws error when store is not initialised", () => {
    const rm = new ReduxManager();
    let action: AnyAction = {
      type: "test_action_type",
      payload: { user: { id: 2 } }
    };
    expect(() => rm.dispatch(action)).toThrow(
      "Store is not created yet. Please call createStore first."
    );
  });

  it("registerReducer() can register reducer with the given name to the state tree", () => {
    const rm = new ReduxManager();
    rm.createStore();
    let reducer = (state = { id: 0 }, action: AnyAction) => {
      if (action.type === "changeId") {
        return { ...state, id: action.newId };
      }
      return state;
    };
    let action: AnyAction = { type: "changeId", newId: 2 };
    rm.registerReducer("user", reducer);
    expect(rm.getState()).toEqual({ user: { id: 0 } });
    rm.dispatch(action);
    expect(rm.getState()).toEqual({ user: { id: 2 } });
  });

  it("registerReducer() can register reducer before the store is created", () => {
    const rm = new ReduxManager();
    let reducer = (state = { id: 0 }, action: AnyAction) => {
      if (action.type === "changeId") {
        return { ...state, id: action.newId };
      }
      return state;
    };
    rm.registerReducer("user", reducer);

    rm.createStore();
    let action: AnyAction = { type: "changeId", newId: 2 };
    expect(rm.getState()).toEqual({ user: { id: 0 } });
    rm.dispatch(action);
    expect(rm.getState()).toEqual({ user: { id: 2 } });
  });

  it("registerState() throws error when register the same reducer multiple times", () => {
    const rm = new ReduxManager();
    rm.createStore();
    let reducer = (state = { id: 0 }, action: AnyAction) => {
      if (action.type === "changeId") {
        return { ...state, id: action.newId };
      }
      return state;
    };
    rm.registerReducer("user", reducer);

    expect(() => rm.registerReducer("user", reducer)).toThrow(
      `Cannot register the reducer. The state tree already has the key ${"user"}.`
    );
  });

  it("registerReducer() can register reducer to preloaded state tree and replace the placeholder reducer", () => {
    const rm = new ReduxManager();
    rm.createStore({ user: { id: 3 } });
    let reducer = (state = { id: 0 }, action: AnyAction) => {
      if (action.type === "changeId") {
        return { ...state, id: action.newId };
      }
      return state;
    };
    let action: AnyAction = { type: "changeId", newId: 2 };
    rm.registerReducer("user", reducer);
    expect(rm.getState()).toEqual({ user: { id: 3 } });
    rm.dispatch(action);
    expect(rm.getState()).toEqual({ user: { id: 2 } });
  });

  it("registerReducer() can register new reducer to preloaded state tree and keep the placeholder reducer not touched", () => {
    const rm = new ReduxManager();
    const preloadedState = { book: { name: "JavaScript: The Good Parts" } };
    const reducer = (state = { id: 0 }, action: AnyAction) => {
      if (action.type === "changeId") {
        return { ...state, id: action.newId };
      }
      return state;
    };
    const action: AnyAction = { type: "changeId", newId: 2 };

    rm.createStore(preloadedState);
    rm.registerReducer("user", reducer);
    expect(rm.getState()).toEqual({
      book: { name: "JavaScript: The Good Parts" },
      user: { id: 0 }
    });

    rm.dispatch(action);
    expect(rm.getState()).toEqual({
      book: { name: "JavaScript: The Good Parts" },
      user: { id: 2 }
    });
  });

  it("registerState() can register state to the state tree", () => {
    const rm = new ReduxManager();
    const userState = createState("user", { id: 0 });
    rm.createStore();
    rm.registerState(userState);
    expect(rm.getState()).toEqual({ user: { id: 0 } });
    const action: AnyAction = { type: "user.id.set", value: 2 };
    rm.dispatch(action);
    expect(rm.getState()).toEqual({ user: { id: 2 } });
  });

  it("registerState() throws error when register a sub level state to the state tree.", () => {
    const rm = new ReduxManager();
    const profileState = createState("profile", { name: "John" });
    const userState = createState("user", { id: 0, profile: profileState });

    expect(() => rm.registerState(profileState)).toThrow(
      "Cannot register the nested state, please use the top level state instead."
    );
  });

  it("registerState() throws error when register the same state multiple times", () => {
    const rm = new ReduxManager();
    const userState = createState("user", { id: 0 });
    rm.createStore();
    rm.registerState(userState);

    expect(() => rm.registerState(userState)).toThrow(
      `Cannot register the reducer. The state tree already has the key ${userState.name}.`
    );
  });

  it("registerState() can register state to preloaded state tree and replace the placeholder reducer", () => {
    const rm = new ReduxManager();
    const userState = createState("user", { id: 0 });
    const preloadedState = { user: { id: 3 } };

    rm.createStore(preloadedState);
    expect(rm.getState()).toEqual(preloadedState);

    rm.registerState(userState);
    expect(rm.getState()).toEqual(preloadedState);

    const action: AnyAction = { type: "user.id.set", value: 2 };
    rm.dispatch(action);
    expect(rm.getState()).toEqual({ user: { id: 2 } });
  });

  it("registerState() can register new state to preloaded state tree and keep the placeholder reducer not touched", () => {
    const rm = new ReduxManager();
    const preloadedState = { book: { name: "JavaScript: The Good Parts" } };
    rm.createStore(preloadedState);

    const userState = createState("user", { id: 0 });
    rm.registerState(userState);

    expect(rm.getState()).toEqual({
      book: { name: "JavaScript: The Good Parts" },
      user: { id: 0 }
    });

    const action: AnyAction = { type: "user.id.set", value: 2 };
    rm.dispatch(action);

    rm.dispatch(action);
    expect(rm.getState()).toEqual({
      book: { name: "JavaScript: The Good Parts" },
      user: { id: 2 }
    });
  });
});
