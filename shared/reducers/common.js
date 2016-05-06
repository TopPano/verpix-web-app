import { merge, assign } from 'lodash';
import { DEFAULT_PROFILE_PHOTO_URL } from '../lib/const.js';

export function handleLoadPostsSuccess(state, action) {
  let { entities: { posts }, result: { result: { page, feed }, firstQuery } } = action.response;
  let hasNext = page.hasNextPage;
  let lastPostId = page.end;

  feed.map((postId) => {
    if(!posts[postId].ownerInfo.profilePhotoUrl) {
      posts[postId].ownerInfo.profilePhotoUrl = DEFAULT_PROFILE_PHOTO_URL;
    }
  });

  let genNextState = undefined;
  if(firstQuery) {
    genNextState = assign; /* overwrite the previous state */
  } else {
    genNextState = merge;
    feed = state.posts.feedIds.concat(feed);
  }
  return genNextState({}, state, {
    isFetching: false,
    posts: {
      feedPosts: posts,
      feedIds: feed,
      hasNext,
      lastPostId
    }
  });
}

