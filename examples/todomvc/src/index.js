import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import 'todomvc-app-css/index.css'
import {ReduxManager, createState} from 'redux-simple-state'

import todosController from './controllers/todosController'
const store = ReduxManager.createStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
ReduxManager.registerState(todosController.state);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
