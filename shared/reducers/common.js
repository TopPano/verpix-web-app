import merge from 'lodash/merge';

export function handleLoadPostsSuccess(state, action) {
  const { page, feed, firstQuery } = action.response.result;
  let hasNext = page.hasNextPage,
      lastPostId = page.end,
      newFeed;

  if(firstQuery) {
    state.posts.feed = [];
    newFeed = feed;
  } else {
    newFeed = state.posts.feed.concat(feed);
  }

  return merge({}, state, {
    isFetching: false,
    posts: {
      feed: newFeed,
      hasNext,
      lastPostId
    }
  });
}

