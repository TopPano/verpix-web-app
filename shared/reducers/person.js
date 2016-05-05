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
import { handleLoadPostsSuccess } from './common';

const DEFAULT_STATE = {
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
};

export default function person(state=DEFAULT_STATE, action) {
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
      return handleLoadPostsSuccess(state, action);
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
