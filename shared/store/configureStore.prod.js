import { createStore, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
  let router = routerMiddleware(browserHistory)
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, router)
  )
}
