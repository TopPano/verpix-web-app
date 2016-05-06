import merge from 'lodash/merge';
import { DEFAULT_PROFILE_PHOTO_URL } from '../lib/const.js';

export function handleLoadPostsSuccess(state, action) {
  let { page, feed, firstQuery } = action.response.result;
  let hasNext = page.hasNextPage,
      lastPostId = page.end;

  feed.map((post) => {
    if(!post.ownerInfo.profilePhotoUrl) {
      post.ownerInfo.profilePhotoUrl = DEFAULT_PROFILE_PHOTO_URL;
    }
  });
  if(firstQuery) {
    state.posts.feed = [];
  } else {
    feed = state.posts.feed.concat(feed);
  }

  return merge({}, state, {
    isFetching: false,
    posts: {
      feed,
      hasNext,
      lastPostId
    }
  });
}

