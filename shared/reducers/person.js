import merge from 'lodash/merge';
import {
  LOAD_USER_SUMMARY_REQUEST,
  LOAD_USER_SUMMARY_SUCCESS,
  LOAD_USER_SUMMARY_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  LIST_FOLLOWERS_REQUEST,
  LIST_FOLLOWERS_SUCCESS,
  LIST_FOLLOWERS_FAILURE,
  LIST_FOLLOWING_REQUEST,
  LIST_FOLLOWING_SUCCESS,
  LIST_FOLLOWING_FAILURE
} from '../actions/user';
import {
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE
} from '../actions/post';
import { handleLoadPostsSuccess } from './common';
import { DEFAULT_PROFILE_PHOTO_URL } from '../lib/const.js';

const DEFAULT_STATE = {
  isFetching: false,
  id: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  followerNum: 0,
  followingNum: 0,
  postNum: 0,
  isFollowing: false,
  followers: {},
  following: {},
  posts: {
    feed: [],
    hasNext: true,
    lastPostId: ''
  }
};

export default function person(state=DEFAULT_STATE, action) {
  let nextState = {};
  switch (action.type) {
    case LOAD_USER_SUMMARY_REQUEST:
    case LOAD_USER_POSTS_REQUEST:
    case FOLLOW_USER_REQUEST:
    case UNFOLLOW_USER_REQUEST:
    case LIST_FOLLOWERS_REQUEST:
    case LIST_FOLLOWING_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case LOAD_USER_SUMMARY_SUCCESS:
      const { sid, username, profilePhotoUrl, followers, following, posts, isFollowing } = action.response.profile;
      return merge({}, state, {
        isFetching: false,
        id: sid,
        username,
        profilePhotoUrl: profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL,
        followerNum: followers,
        followingNum: following,
        postNum: posts,
        isFollowing
      });
    case LOAD_USER_POSTS_SUCCESS:
      return handleLoadPostsSuccess(state, action);
    case FOLLOW_USER_SUCCESS:
      nextState = { isFetching: false };
      if (state.id === action.followeeId) {
        nextState = merge(nextState, { isFollowing: true });
      }
      if (state.followers[action.followeeId]) {
        nextState = merge(nextState, JSON.parse(`{ followers: { ${action.followeeId}: { isFriend: true } } }`));
      }
      return merge({}, state, nextState);
    case UNFOLLOW_USER_SUCCESS:
      nextState = { isFetching: false };
      if (state.id === action.followeeId) {
        nextState = merge(nextState, { isFollowing: false });
      }
      if (state.followers[action.followeeId]) {
        nextState = merge(nextState, JSON.parse(`{ followers: { ${action.followeeId}: { isFriend: false } } }`));
      }
      return merge({}, state, nextState);
    case LIST_FOLLOWERS_SUCCESS:
      const { entities: { followerList } }= action.response;
      return merge({}, state, {
        isFetching: false,
        followers: followerList
      });
    case LIST_FOLLOWING_SUCCESS:
      const { entities: { followingList } }= action.response;
      return merge({}, state, {
        isFetching: false,
        following: followingList
      });
    case LOAD_USER_SUMMARY_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
    case FOLLOW_USER_FAILURE:
    case UNFOLLOW_USER_FAILURE:
    case LIST_FOLLOWERS_FAILURE:
    case LIST_FOLLOWING_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
