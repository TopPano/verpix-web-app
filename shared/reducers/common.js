import merge from 'lodash/merge';
import assign from 'lodash/assign';

export function handleLoadPostsSuccess(state, action) {
  let { entities: { posts }, result: { result: { page, feed }, firstQuery } } = action.response;
  let hasNext = page.hasNextPage;
  let lastPostId = page.end;

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

