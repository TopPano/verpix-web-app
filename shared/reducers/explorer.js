import merge from 'lodash/merge';
import {
  LOAD_EXPLORE_RECENT_REQUEST,
  LOAD_EXPLORE_RECENT_SUCCESS,
  LOAD_EXPLORE_RECENT_FAILURE
} from '../actions/post';

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
      const { page, feed } = action.response.result;
      let newFeed = state.recent.posts.feed.concat(feed);
      let hasNext = page.hasNextPage;
      let lastPostId = page.end;

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
