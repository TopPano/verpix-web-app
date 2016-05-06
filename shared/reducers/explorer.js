import merge from 'lodash/merge';
import {
  LOAD_EXPLORE_RECENT_REQUEST,
  LOAD_EXPLORE_RECENT_SUCCESS,
  LOAD_EXPLORE_RECENT_FAILURE
} from '../actions/post';
import { handleLoadPostsSuccess } from './common';
import { DEFAULT_PROFILE_PHOTO_URL } from '../lib/const.js';

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
      let { page, feed, firstQuery } = action.response.result;
      let hasNext = page.hasNextPage,
          lastPostId = page.end;

      feed.map((post) => {
        if(!post.ownerInfo.profilePhotoUrl) {
          post.ownerInfo.profilePhotoUrl = DEFAULT_PROFILE_PHOTO_URL;
        }
      });
      if(firstQuery) {
        state.recent.posts.feed = [];
      } else {
        feed = state.recent.posts.feed.concat(feed);
      }

      return merge({}, state, {
        isFetching: false,
        recent: {
          posts: {
            feed,
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