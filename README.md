# redux-simple-state

redux-simple-state automatically generates the redux actions and reducers for you based on the intial state. It lets you add or remove a field in a few seconds and its `get/set` API makes the redux development super easy. Instead of spending hours on maintaining actions and reducers, now you can focus on more important works.

## Quick start

Create the store and inject the todos state

```js
import { ReduxManager, createState } from "redux-simple-state";

// Create store
const store = ReduxManager.createStore();

const INITIAL_STATE = {
  todos: [],
  visibilityFilter: "SHOW_ALL"
};

// Generate simple state based on the initial state
const state = createState("todosState", INITIAL_STATE);

//Injects the todos state to the state tree
ReduxManager.registerState(state);

/*
 *  The state tree now looks like:
 * {
 *   todosState:{
 *       todos:[],
 *       visibilityFilter: "SHOW_ALL"
 *   }
 * }
 */
```

To read the value of visibilityFilter:

```js
let filter = state.visibilityFilter.get();
```

To change the value of visibilityFilter:

```js
state.visibilityFilter.set("SHOW_COMPLETED");
```

To access the selector of visibilityFilter

```js
let visibilityFilterSelector = state.visibilityFilter.selector;
```

To insert a new todo to todos

```js
state.todos.addItem({ id: 0, text: "first todo", completed: false });
```

To add a new field into the state tree, you can just modify the INITIAL_STATE

```js
const INITIAL_STATE = {
  todos: [],
  visibilityFilter: "SHOW_ALL",
  user: null
};

/*
 *  The state tree now looks like:
 * {
 *   todosState:{
 *       todos:[],
 *       visibilityFilter: "showSHOW_ALL",
 *       user: null
 *   }
 * }
 */

// Get value
let userDetail = this.state.user.get();
// Set value
this.state.user.set({ id: "1" });
```

You can find the completed example in `./examples` folder.

1. todomvc
1. todomvc-typescript

## Introduction

In the most situations, we use Redux as a global state store where we can save our data
globally and share it among the app. However the cost is that we have to deal with actions
and reducers. Especially for a project with a complex state structure, maintaining the
actions, reducers and constants can be very cumbersome.

**We just need a place to save data, can we have a simple way to do it?**

redux-simple-state is a utility to simplify the process when working with Redux-based projects.
The goal of this library is to make the Redux as transparent as possible, so that you can read/write
states without knowing actions and reducers. It does **NOT** change the behavior of Redux.
Below is a list of highlighted features.

- Dynamically generates actions and reducers based on the initial state, which allows
  you to add a new filed to the state or change existing state in a few seconds.
- Every filed in the state tree has a default selector that you can bind to a view or use
  in a side-effect library such as `redux-saga`.
- Has a higher level `get` function and a `set` function to read and write the value
  of a field without exposing details of state store and dispatching mechanism.
- `ReduxManager` allows you to getState or dispatch an action from anywhere without
  accessing the Store object directly
- `ReduxManager` also allows you to inject new state or reducer on the fly

**Note:** `seamless-immutable` is **NOT** supported yet.

## Install

Install `redux` and `reselect` first.

```js
yarn add redux reselect
yarn add redux-simple-state
```

Or

```js
npm install --save redux reselect
npm install --save redux-simple-state
```

## Use with [`connected-react-router`](https://github.com/supasate/connected-react-router)

```js
import { applyMiddleware, compose } from "redux";
import { ReduxManager } from "redux-simple-state";
import { connectRouter } from "connected-react-router";
import { routerMiddleware } from "connected-react-router";

export default function configureStore(initialState = {}, history) {
  const enhancers = [applyMiddleware(routerMiddleware(history))];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;

  const store = ReduxManager.createStore(
    initialState,
    composeEnhancers(...enhancers)
  );
  ReduxManager.registerReducer("router", connectRouter(history));
  // ... rest of your simple states or reducers
  // ReduxManager.registerState(myState);

  return { store };
}
```

## Use with [`redux-persist`](https://github.com/rt2zz/redux-persist)

```js
import { applyMiddleware, compose } from "redux";
import {ReduxManager, createState} from 'redux-simple-state'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

... //create store

let persistor = persistStore(store);

const INITIAL_STATE={
    todos:[],
    visibilityFilter: "SHOW_ALL"
}

const todosState = createState("todos", INITIAL_STATE)

const persistConfig = {
  key: "todos",
  whitelist: ["visibilityFilter", "todos"],
  storage
};

// Note: The properties with the prefix underscore are StateContainer's own properties.
// The underscroe is used to differentiate from those dynamically added properties.
ReduxManager.registerReducer(
  todosState._name,
  persistReducer(persistConfig, todosState._reducer)
);

... //wrap your root component with PersistGate
```

## API

We generate actions and reducers for a field based on the type of its initial value. These five types are supported.

1. Object
1. String
1. Number
1. Array
1. Boolean

If the default value is `null`, the field is marked as an Object.

### createState

Creates a state. The state is an instance of `StateContainer`. You can inject the state to the store when necessary,
and use it to get or set value of a field in it.

```js
// THe initial value can be a nested object
let state = createState("demo", {
  filter: "all_completed",
  profile: {
    id: 1,
    name: "",
    is_active: true
  }
});

ReduxManager.registerState(state);

/*
 *  The state tree now looks like:
 * {
 *   demo:{
 *       filter: "all_completed",
 *       profile:{
 *            id: 1,
 *            name: "",
 *            is_active: true
 *        }
 *   }
 * }
 */
```

Params:

- name (String): The name of the field
- initialValue (not Function): The default value of the field.

Returns:

A `StateContainer` instance.

### ReduxManager

The singleton instance which allows you to access store from anywhere.

#### ReduxManager.createStore([preloadedState], [enhancer])

Creates a Redux store that holds the complete state tree of your app.
This function is similar as the [createStore](https://redux.js.org/api/createstore#createstorereducer-preloadedstate-enhancer)
from Redux except that it doesn't accept default reducer. Please user `ReduxManager.register` or `ReduxManger.registerState`
to inject the reducers.

Params:

- preloadedState (string): The initial state.
- enhancer (Function): The store enhancer.

Returns:

- Store (Object): Same as the Redux store object.

#### ReduxManager.registerReducer(name, reducer)

Injects the reducer to the store using the given name. This function is useful when you want to partialy migrate your project to the redux-simple-state, or you have third-party reducer to add in, such as connected-react-route.

Params:

- name (String): The field name.
- reducer (Function): A reducing function that returns the next state tree.

Returns:

- None

Example:

```js
import { ReduxManager } from "redux-simple-state";

const initialState = { todos: [], visibilityFilter: "SHOW_ALL" };

function todoAppReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    case "ADD_TODO":
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      });
    default:
      return state;
  }
}

ReduxManager.registerReducer("todos", todoAppReducer);
```

#### ReduxManager.registerState(state)

Injects new state to the store.

Params:

- state (StateContainer): The state returned by `createState` function. The name of state will be used as the field name.

Returns:

- None

Example:

```js
import { ReduxManager, createState } from "redux-simple-state";

const initialState = { todos: [], visibilityFilter: "SHOW_ALL" };

const todosState = createState("todos", initialState);

ReduxManager.registerState(todosState);

// To add a todo
todosState.todos.addItem({
  text: "Buy milk",
  completed: false,
  id: 1
});

// To change visibilityFilter
todosState.visibilityFilter.set("SHOW_COMPLETED");
```

#### ReduxManager.dispatch(action)

Dispatches an action to the store. Same as `store.dispatch` in Redux. Please check [Redux document](https://redux.js.org/api/store#dispatchaction) for more details.

Params:

- action (Object): A plain object describing the change that makes sense for your application.

Returns:

- (Object): The dispatched action (see notes).

Example:

```js
import { ReduxManager } from "redux-simple-state";

let myAction = { type: "SET_VISIBILITY_FILTER", filter: "SHOW_COMPLETED" };

ReduxManager.dispatch(myAction);
```

#### ReduxManager.getState()

Returns the current state tree of your application. Same as `store.getState` in Redux. Please check [Redux document](https://redux.js.org/api/store#getstate) for more details.

Returns:

- (Any): The current state tree of your application.

Example:

```js
import { ReduxManager } from "redux-simple-state";

const currentState = ReduxManager.getState();
```

### StateContainer

A container of a state which gives you all the conveniences to operate the state. You should only create a state container via
`createState` function. The function will wire the actions and reducers based on the initial value.

#### Props:

**selector**

A selector function which accepts a state object and returns the value of the field

```js
let myState = createState("demo", {
  filter: "all_completed",
  profile: {
    id: 1,
    name: "",
    is_active: true
  }
});

// For the root field
let selector = myState.selector;

// For sub field
let filterSelector = myState.filter.selector;
let profileIdSelector = myState.profile.id.selector;
```

Use with `react-redux`

```js
function mapStateToProps(state) {
  return { profile: myState.profile.selector(state) };
}
```

Or together with `reselect`

```js
import { createStructuredSelector } from "reselect";

const mapStateToProps = createStructuredSelector({
  profile: myState.profile.selector
});
```

Use with `redux-saga`

```js
function* handler() {
  yield select(myState.filter.selector);
}
```

Write your own selectors

```js
import { createSelector } from "reselect";
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "./constants/TodoFilters";
import state from "./todosState";

export const getVisibleTodos = createSelector(
  [state.visibilityFilter.selector, state.todos.selector],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case SHOW_ALL:
        return todos;
      case SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        throw new Error("Unknown filter: " + visibilityFilter);
    }
  }
);

export const getTodoCount = createSelector(
  [state.todos.selector],
  todos => todos.length
);
```

#### Functions:

**get()**

Returns the value of the field. Please make sure you call this function only after the state is registered.

```js
let myState = createState("demo", {
  filter: "all_completed",
  profile: {
    id: 1,
    name: "",
    is_active: true
  },
  books: []
});

//For the root field
let value = myState.get();

//For sub field
let filter = myState.filter.get(); // returns "all_completed"
let profileId = myState.profile.id.get(); // returns 1
let books = mySate.books.get(); // return []
```

**set(value)**

Set the value of the field. We don't check the type of the new value before writing to the filed. Please make sure
to use correct value. For example, the value should be an object if the field is an object.

```js
let myState = createState("demo", {
  filter: "all_completed",
  profile: {
    id: 1,
    name: "",
    is_active: true
  },
  books: []
});

myState.filter.set("show_all");
myState.profile.id.set(2);
myState.books.set(["Learn JavaScript"]);

// for nested object
myState.profile.set({
  id: 2,
  name: "test",
  is_active: false
});

// If you just want to update the object, you can use `myState.profile.update` instead of set.
// There are more details below.
```

**resetToDefault()**

Resets the value of the filed to its initial value.

Example:

```js
import { ReduxManager, createState } from "redux-simple-state";

const initialState = { todos: [], visibilityFilter: "SHOW_ALL" };
const todosState = createState("todos", initialState);
ReduxManager.registerState(todosState);

todosState.visibilityFilter.set("SHOW_COMPLETED");
todosState.visibilityFilter.get(); // return SHOW_COMPLETED

todosState.visibilityFilter.resetToDefault();
todosState.visibilityFilter.get(); // return SHOW_ALL
```

#### Object Field

Except the shared functions, the Object field has one more function.

**update(value)**

Update the object. The new value will be merged. Same as doing this:

```js
let newState = { ...state, ...value };
```

Params:

- value(Object)

```js
state.profile.update({
  is_active: false
});
```

#### Array Field

Except the shared functions, the Array field has a few more functions to manipulate its items.

**addItem(item)**

Adds the news item to the end of the array.
Params:

- item(Any)

Example:

```js
... // create todosState

todosState.todos.addItem({
  text: "Buy milk",
  completed: false,
  id: 1
})
```

**updateItems(query, value):**

Updates all matched items by the given value. If the value is an object, it will be merged to existing object.

Params:

- query (Function): Query is a function accepts an item in the array, and returns a boolean which indicates if the item is selected.
- value (Any)

Example:

```js
... // create todosState

// Mark todo 1 as completed
todosState.todos.updateItems((todo)=>todo.id === 1, { completed:true });

// Mark incompleted todos as completed
todosState.todos.updateItems((todo)=>!todo.completed, { completed:true });
```

**updateAll(value)**

Updates all the items in the array by the given value. If the value is an object, it will be merged to existing object.

Params:

- value (Any)

Example:

```js
... // create todosState

// Mark all todos as completed
todosState.todos.updateAll({ completed:true });
```

**deleteItems(query)**

Deletes all matched items.

Params:

- query (Function): Query is a function accepts an item in the array, and returns a boolean which indicates if the item is selected.

Example:

```js
... // create todosState

// Delete all completed todos
todosState.todos.deleteItems((todo)=>todo.completed);
```

**deleteAll()**

Deletes all items.

Example:

```js
... // create todosState

// Delete all todos
todosState.todos.deleteAll();
```
