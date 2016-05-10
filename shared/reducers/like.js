import { merge, assign } from 'lodash';
import {
  SHOW_LIKE_LIST_REQUEST,
  SHOW_LIKE_LIST_SUCCESS,
  SHOW_LIKE_LIST_FAILURE
} from '../actions/post';

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
    case SHOW_LIKE_LIST_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
