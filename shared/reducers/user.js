import merge from 'lodash/merge';
import cookie from 'cookie';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS
} from '../actions/user';
//import auth from '../lib/auth';

const DEFAULT_STATE = {
  isFetching: false,
  isAuthenticated: process.env.BROWSER ? Boolean(cookie.parse(document.cookie).accessToken) : false,
  userId: undefined,
  username: undefined,
  profilePhotoUrl: undefined,
  email: undefined,
  created: undefined
};

export default function user(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case LOGOUT_USER_REQUEST:
      return merge({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
    case LOGIN_USER_SUCCESS:
      const { id, userId, created, user: { username, profilePhotoUrl, email } } = action.user;
      // XXX: Though Reducer should be pure without any side effect, however, we need to make a copy of the
      //      user state in cookie in order for server to restore from it, so centralize the code here would
      //      be clean.
      //      Move these code to action creator (loginUser) if it has any side effect.
      document.cookie = cookie.serialize('accessToken', id, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('userId', userId, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('username', username, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('profilePhotoUrl', profilePhotoUrl, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('email', email, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('created', created, { path: '/', maxAge: 900000 });
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: true,
        userId,
        username,
        profilePhotoUrl,
        email,
        created
      });
    case LOGOUT_USER_SUCCESS:
      document.cookie = cookie.serialize('accessToken', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      document.cookie = cookie.serialize('userId', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      document.cookie = cookie.serialize('username', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      document.cookie = cookie.serialize('profilePhotoUrl', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      document.cookie = cookie.serialize('email', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      document.cookie = cookie.serialize('created', '', { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: false,
        userId: undefined,
        username: undefined,
        profilePhotoUrl: undefined,
        email: undefined,
        created: undefined
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
