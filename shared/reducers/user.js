import merge from 'lodash/merge';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE
} from '../actions/user';
import auth from '../lib/auth';

export default function user(state={
  isFetching: false,
  isAuthenticated: auth.isAuthenticated(),
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  email: undefined,
  created: undefined
}, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return merge({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
    case LOGIN_USER_SUCCESS:
      const { userId, created, user: { username, profilePhotoUrl, email } } = action.user;
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: true,
        userId,
        username,
        profilePhotoUrl,
        email,
        created
      });
    case LOGIN_USER_FAILURE:
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      });
    default:
      return state;
  }
}
