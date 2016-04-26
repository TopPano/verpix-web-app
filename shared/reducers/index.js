import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import person from './person';

const rootReducers = combineReducers({
  user,
  person,
  routing
})

export default rootReducers
