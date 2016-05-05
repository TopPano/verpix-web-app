import merge from 'lodash/merge';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE
} from '../actions/user';
import {
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE
} from '../actions/post';
import { handleLoadPostsSuccess } from './common';

const DEFAULT_STATE = {
  isFetching: false,
  id: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  followerNum: 0,
  followingNum: 0,
  postNum: 0,
  isFollowing: false,
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
    case FOLLOW_USER_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_USER_SUMMARY_SUCCESS:
      const { sid, username, profilePhotoUrl, followers, following, posts, isFollowing } = action.response.profile;
      return merge({}, state, {
        isFetching: false,
        id: sid,
        username,
        profilePhotoUrl,
        followerNum: followers,
        followingNum: following,
        postNum: posts,
        isFollowing
      });
    case LOAD_USER_POSTS_SUCCESS:
      return handleLoadPostsSuccess(state, action);
    case FOLLOW_USER_SUCCESS:
      const followeeId = action.followeeId;
      if (state.id !== followeeId) {
        return merge({}, state, { isFetching: false });
      }
      return merge({}, state, { isFetching: false, isFollowing: true });
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
    case FOLLOW_USER_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
