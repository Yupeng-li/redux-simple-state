import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import "todomvc-app-css/index.css";
import { ReduxManager } from "redux-simple-state";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistGate } from "redux-persist/integration/react";

import todosController from "./controllers/todosController";
const store = ReduxManager.createStore(
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let persistor = persistStore(store);

const persistConfig = {
  key: "todos",
  whitelist: ["visibilityFilter", "todos"],
  storage
};

ReduxManager.registerReducer(
  todosController.state._name,
  persistReducer(persistConfig, todosController.state._reducer)
);

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
