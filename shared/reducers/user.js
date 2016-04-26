import merge from 'lodash/merge';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE
} from '../actions/user';

export default function user(state={
  isProcessing: false,
  userId: undefined,
  created: undefined,
  auth: {}
}, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return merge({}, state, {
        isProcessing: true
      });
    case LOGIN_USER_SUCCESS:
      const { id, ttl, created, userId } = action.response;
      return merge({}, state, {
        isProcessing: false,
        userId,
        created,
        auth: {
          token: id,
          ttl
        }
      });
    case LOGIN_USER_FAILURE:
      return merge({}, state, {
        isProcessing: false
      });
    default:
      return state;
  }
}
