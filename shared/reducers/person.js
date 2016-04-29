import merge from 'lodash/merge';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE
} from '../actions/user';
import {
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE
} from '../actions/post';

export default function person(state={
  isFetching: false,
  profilePhotoUrl: undefined,
  followerNum: 0,
  followingNum: 0,
  postNum: 0,
  posts: {
    feed: [],
    hasNext: true,
    lastPostId: ''
  }
}, action) {
  switch (action.type) {
    case LOAD_USER_SUMMARY_REQUEST:
    case LOAD_USER_POSTS_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_USER_SUMMARY_SUCCESS:
      const { username, profilePhotoUrl, followers, following, posts } = action.response.profile;
      return merge({}, state, {
        isFetching: false,
        username,
        profilePhotoUrl,
        followerNum: followers,
        followingNum: following,
        postNum: posts
      });
    case LOAD_USER_POSTS_SUCCESS:
      const { page, feed } = action.response.result;
      let newFeed = state.posts.feed.concat(feed),
          hasNext = page.hasNextPage,
          lastPostId = page.end

      return merge({}, state, {
        isFetching: false,
        posts: {
          feed: newFeed,
          hasNext,
          lastPostId
        }
      });
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
