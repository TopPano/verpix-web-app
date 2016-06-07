import 'core-js/fn/object/assign'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, match, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import routes from 'shared/routes'
import configureStore from 'store/configureStore'


const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)
const history = syncHistoryWithStore(browserHistory, store)
const rootElement = document.getElementById('app')

// Render the main component into the dom
match({ history, routes }, (error, redirectLocation, renderProps) => {
  render(
    <Provider store={store}>
      <div>
        <Router {...renderProps} />
      </div>
    </Provider>,
    rootElement
  );
});
