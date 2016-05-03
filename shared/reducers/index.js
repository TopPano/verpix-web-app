import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import user from './user';
import person from './person';
import newsFeed from './newsFeed';

const rootReducers = combineReducers({
  user,
  person,
  newsFeed,
  routing
})

export default rootReducers
