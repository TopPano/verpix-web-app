import merge from 'lodash/merge';
import {
  LOAD_EXPLORE_RECENT_REQUEST,
  LOAD_EXPLORE_RECENT_SUCCESS,
  LOAD_EXPLORE_RECENT_FAILURE
} from '../actions/post';
import { handleLoadPostsSuccess } from './common';

const DEFAULT_STATE = {
  isFetching: false,
  recent: {
    posts: {
      feed: [],
      hasNext: true,
      lastPostId: ''
    }
  }
};

export default function explorer(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOAD_EXPLORE_RECENT_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_EXPLORE_RECENT_SUCCESS:
      const { page, feed, firstQuery } = action.response.result;
      let hasNext = page.hasNextPage,
          lastPostId = page.end,
          newFeed;

      if(firstQuery) {
        state.recent.posts.feed = [];
        newFeed = feed;
      } else {
        newFeed = state.recent.posts.feed.concat(feed);
      }

      return merge({}, state, {
        isFetching: false,
        recent: {
          posts: {
            feed: newFeed,
            hasNext,
            lastPostId
          }
        }
      });
    case LOAD_EXPLORE_RECENT_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
