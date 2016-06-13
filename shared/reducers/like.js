import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  SHOW_LIKE_LIST_REQUEST,
  SHOW_LIKE_LIST_SUCCESS,
  SHOW_LIKE_LIST_FAILURE
} from '../actions/post';
import {
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE
} from '../actions/user';

const DEFAULT_STATE = {
  isFetching: false,
  list: {
    users: {},
    userIds: []
  }
};

export default function likeList(state=DEFAULT_STATE, action) {
  let nextState = {};
  switch (action.type) {
    case SHOW_LIKE_LIST_REQUEST:
    case FOLLOW_USER_REQUEST:
    case UNFOLLOW_USER_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case SHOW_LIKE_LIST_SUCCESS:
      const { entities: { users }, result: { result } } = action.response;
      return assign({}, state, {
        isFetching: false,
        list: {
          users,
          userIds: result
        }
      })
    case FOLLOW_USER_SUCCESS:
      nextState = { isFetching: false };
      if (state.list.users[action.followeeId]) {
        nextState = merge({}, nextState, {
          list: {
            users: {
              [action.followeeId]: {
                isFollowing: true
              }
            }
          }
        });
      }
      return merge({}, state, nextState);
    case UNFOLLOW_USER_SUCCESS:
      if (state.list.users[action.followeeId]) {
        nextState = merge({}, nextState, {
          isFetching: false,
          list: {
            users: {
              [action.followeeId]: {
                isFollowing: false
              }
            }
          }
        });
      }
      return merge({}, state, nextState);
    case SHOW_LIKE_LIST_FAILURE:
    case FOLLOW_USER_FAILURE:
    case UNFOLLOW_USER_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
