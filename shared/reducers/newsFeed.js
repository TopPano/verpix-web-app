import merge from 'lodash/merge';
import {
  LOAD_NEWSFEED_REQUEST,
  LOAD_NEWSFEED_SUCCESS,
  LOAD_NEWSFEED_FAILURE
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

export default function newsFeed(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOAD_NEWSFEED_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_NEWSFEED_SUCCESS:
      return handleLoadPostsSuccess(state, action);
    case LOAD_NEWSFEED_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
