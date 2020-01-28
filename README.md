# redux-simple-state
In the most situations, we use Redux as a global state store where we can save our data
globally and share it among the app. However the cost is that we have to deal with actions
and reducers. Especially for a project with a complex state structure, maintaining the 
actions, reducers and constants can be very cumbersome. 

**We just need a place to save data, can we have a simple way to do it?**
 
redux-simple-state is a utility to simplify the process when working with Redux-based projects. 
The goal of this library is to make the Redux as transparent as possible, so that you can read/write 
states without knowing actions and reducers. It does **NOT** change the behavior of Redux. 
Below is a list of highlighted features.  
- Dynamically generates actions and reducers  based on the initial state, which allows 
you to add a new filed to the state or change existing state in a few seconds.
- Every filed in the state tree has a default selector that you can bind to a view or use 
in a side-effect library such as `redux-saga`.
- Has a higher level `get` function and a `set` function to read and write the value 
of a field without exposing details of state store and dispatching mechanism.   
- `ReduxManager` allows you to getState or dispatch an action from anywhere without 
accessing the Store object directly
- `ReduxManager` also allows you to inject new state or reducer on the fly

**Note:** `redux-persist` and `seamless-immutable` are **NOT** supported yet.
## Example

Create the store and inject the todos state
```js
import {ReduxManager, createState} from 'redux-simple-state'

const INITIAL_STATE={
    todos:[],
    visibilityFilter: "show_all"
}

const state = createState("todosState", INITIAL_STATE)

const store = ReduxManager.createStore();

//Injects the todos state to the state tree
ReduxManager.registerState(state)

/*
*  The state tree now looks like:
* {
*   todosState:{
*       todos:[],
*       visibilityFilter: "show_all"
*   }
* }
*/
```
To read the value of visibilityFilter:
```js
let filter = state.visibilityFilter.get()
```
To change the value of visibilityFilter:
```js
state.visibilityFilter.set("show_completed")
```
To access the selector of visibilityFilter
```js
let visibilityFilterSelector = state.visibilityFilter.selector
```
To insert a new todo to todos
```js
state.todos.addItem({id:0, text:"first todo", completed:false})
```

You can find the completed example in `./examples` folder.  

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
    profile:{
        id: 1,
        name: "",
        is_active: true
    }
})

ReduxManager.registerState(state)

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

#### ReduxManager.register(name, reducer)
Injects the reducer to the store using the given name. 

Params:
- name (String): The field name.
- reducer (Function):  A reducing function that returns the next state tree.

Returns: 
- None

#### ReduxManager.registerState(state)
Injects new state to the store. 

Params:
- state (StateContainer): The state returned by `createState` function. The name of state will be used as the field name.

Returns: 
- None

#### ReduxManager.dispatch(action)
Dispatches an action to the store. Same as `store.dispatch` in Redux. Please check [Redux document](https://redux.js.org/api/store#dispatchaction) for more details.

Params:
- action (Object): A plain object describing the change that makes sense for your application.

Returns: 
- (Object): The dispatched action (see notes).

#### ReduxManager.getState()
Returns the current state tree of your application. Same as `store.getState` in Redux. Please check [Redux document](https://redux.js.org/api/store#getstate) for more details.

Returns: 
- (Any): The current state tree of your application.

### StateContainer
A container of a state which gives you all the conveniences to operate the state. You should only create a state container via
`createState` function. The function will wire the actions and reducers based on the initial value. 

Props:

**selector**

 A selector function which accepts a state object and returns the value of the field
```js
let state = createState("demo", {
    filter: "all_completed",
    profile:{
        id: 1,
        name: "",
        is_active: true
    }
})

//For the root field
let selector = state.selector

//For sub field
let filterSelector = state.filter.selector
let profileIdSelector = state.profile.id.selector
```

Functions:

**get()**

Returns the value of the field. Please make sure you call this function only after the state is registered.

```js
//For the root field
let value = state.get();

//For sub field
let filter = state.filter.get() // returns "all_completed"
let profileId = state.profile.id.get() // returns 1
```

**set(value)**

Set the value of the field. We don't check the type of the new value before writing to the filed. Please make sure 
to use correct value. For example, the value should be an object if the field is an object.

```js
state.filter.set("show_all") 
state.profile.id.set(2) 
// for nested object
state.profile.set({
        id: 2,
        name: "test",
        is_active: false
}) 
// If you just want to update the object, you can use `state.profile.update` instead of set.  
// There are more details below.

```

**resetToDefault()**

Resets the value of the filed to its initial value. 

#### Object Field
Except the shared functions, the Object field has one more function.

**update(value)**

Update the object. The new value will be merged to the existing object and override the same fields.

Params:
- value(Object)

```js
state.profile.update({
        is_active: false
}) 
```

#### Array Field
Except the shared functions, the Array field has a few more functions to manipulate its items.

**addItem(item)**

Adds the news item to the end of the array. 
Params:
- item(Any)

**updateItems(query, value):**

Updates all matched items by the given value. If the value is an object, it will be merged to existing object.

Params:
- query (Function): Query is a function accepts an item in the array, and returns a boolean which indicates if the item is selected.
- value (Any)

**updateAll(value)**

Updates all the items in the array by the given value. If the value is an object, it will be merged to existing object.

Params:
- value (Any)

**deleteItems(query)**

Deletes all matched items. 

Params:
- query (Function): Query is a function accepts an item in the array, and returns a boolean which indicates if the item is selected.

**deleteAll()**

Deletes all items. 


