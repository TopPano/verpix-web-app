import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import {
  LOAD_EXPLORE_RECENT_REQUEST,
  LOAD_EXPLORE_RECENT_SUCCESS,
  LOAD_EXPLORE_RECENT_FAILURE
} from '../actions/post';
import { handleLoadPostsSuccess } from './common';

const DEFAULT_STATE = {
  isFetching: false,
  posts: {
    feedPosts: {},
    feedIds: [],
    hasNext: true,
    lastPostId: ''
  }
};

function recent(state=DEFAULT_STATE, action) {
  let nextState = {};
  switch (action.type) {
    case LOAD_EXPLORE_RECENT_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_EXPLORE_RECENT_SUCCESS:
      return handleLoadPostsSuccess(state, action);
    case LOAD_EXPLORE_RECENT_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}

export default combineReducers({
  recent
});
