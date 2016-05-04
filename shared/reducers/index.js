import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import person from './person';
import newsFeed from './newsFeed';
import explorer from './explorer';

const rootReducers = combineReducers({
  user,
  person,
  newsFeed,
  explorer,
  routing
})

export default rootReducers
