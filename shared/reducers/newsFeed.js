import merge from 'lodash/merge';
import {
  LOAD_NEWSFEED_REQUEST,
  LOAD_NEWSFEED_SUCCESS,
  LOAD_NEWSFEED_FAILURE
} from '../actions/post';
import auth from '../lib/auth';

const DEFAULT_STATE = {
  isFetching: false,
  posts: {
    feed: [],
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
      const { page, feed } = action.response.result;
      let newFeed = state.posts.feed.concat(feed);
      let hasNext = page.hasNextPage;
      let lastPostId = page.end;

      return merge({}, state, {
        isFetching: false,
        posts: {
          feed: newFeed,
          hasNext,
          lastPostId
        }
      });
    case LOAD_NEWSFEED_FAILURE:
      return merge({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
