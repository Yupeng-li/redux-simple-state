import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import 'todomvc-app-css/index.css'
import {ReduxManager, createState} from 'redux-simple-state'

import todosController from './controllers/todosController'
const store = ReduxManager.createStore(todosController.state.reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
