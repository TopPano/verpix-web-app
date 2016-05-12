import { merge, assign } from 'lodash';
import {
  SHOW_LIKE_LIST_REQUEST,
  SHOW_LIKE_LIST_SUCCESS,
  SHOW_LIKE_LIST_FAILURE
} from '../actions/post';
import {
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE
} from '../actions/user';

const DEFAULT_STATE = {
  isFetching: false,
  list: {
    users: {},
    userIds: []
  }
};

export default function likeList(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case SHOW_LIKE_LIST_REQUEST:
    case FOLLOW_USER_REQUEST:
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
      if (state.list.users[action.followeeId]) {
        return merge({}, state, {
          isFetching: false,
          list: {
            users: {
              [aciton.followeeId]: {
                user: {
                  followers: [
                    {
                      followerId: action.followerId,
                      followeeId: action.followeeId,
                      followAt: new Date()
                    }
                  ]
                }
              }
            }
          }
        });
      }
      return state;
    case SHOW_LIKE_LIST_FAILURE:
    case FOLLOW_USER_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
