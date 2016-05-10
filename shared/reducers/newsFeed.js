import merge from 'lodash/merge';
import {
  LOAD_NEWSFEED_REQUEST,
  LOAD_NEWSFEED_SUCCESS,
  LOAD_NEWSFEED_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE
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
  let nextState = {};
  switch (action.type) {
    case LOAD_NEWSFEED_REQUEST:
    case LIKE_POST_REQUEST:
    case UNLIKE_POST_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_NEWSFEED_SUCCESS:
      return handleLoadPostsSuccess(state, action);
    case LIKE_POST_SUCCESS:
      nextState = { isFetching: false };
      if (state.posts.feedPosts[action.id]) {
        let count = state.posts.feedPosts[action.id].likes.count + 1;
        nextState = merge(nextState, {
          posts: {
            feedPosts: {
              [action.id]: {
                likes: {
                  count,
                  isLiked: true
                }
              }
            }
          }
        });
      }
      return merge({}, state, nextState);
    case UNLIKE_POST_SUCCESS:
      nextState = { isFetching: false };
      if (state.posts.feedPosts[action.id]) {
        let count = state.posts.feedPosts[action.id].likes.count - 1;
        nextState = merge(nextState, {
          posts: {
            feedPosts: {
              [action.id]: {
                likes: {
                  count,
                  isLiked: false
                }
              }
            }
          }
        });
      }
      return merge({}, state, nextState);
    case LOAD_NEWSFEED_FAILURE:
    case LIKE_POST_FAILURE:
    case UNLIKE_POST_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
