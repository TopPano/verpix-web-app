import { merge, assign } from 'lodash';
import cookie from 'cookie';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  FACEBOOK_TOKEN_LOGIN_SUCCESS,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS
} from '../actions/user';
import { DEFAULT_PROFILE_PHOTO_URL } from '../lib/const.js';

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
    case FACEBOOK_TOKEN_LOGIN_SUCCESS:
      if (action.type === LOGIN_USER_SUCCESS) {
        const { id, userId, created, user: { username, profilePhotoUrl, email } } = action.response;
      } else {
        const {
          token: { id, userId, created },
          user: { profilePhotoUrl, email },
          identity: { profile: { displayName } }
        } = action.response.auth;
      }
      let _username = username ? username : displayName;
      let _profilePhotoUrl = profilePhotoUrl ? profilePhotoUrl : DEFAULT_PROFILE_PHOTO_URL;
      // XXX: Though Reducer should be pure without any side effect, however, we need to make a copy of the
      //      user state in cookie in order for server to restore from it, so centralize the code here would
      //      be clean.
      //      Move these code to action creator (loginUser) if it has any side effect.
      document.cookie = cookie.serialize('accessToken', id, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('userId', userId, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('username', _username, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('profilePhotoUrl', _profilePhotoUrl, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('email', email, { path: '/', maxAge: 900000 });
      document.cookie = cookie.serialize('created', created, { path: '/', maxAge: 900000 });
      return merge({}, state, {
        isFetching: false,
        isAuthenticated: true,
        userId,
        username: _username,
        profilePhotoUrl: _profilePhotoUrl,
        email,
        created
      });
    case LOGOUT_USER_SUCCESS:
      let expireDate = new Date(0);
      document.cookie = cookie.serialize('accessToken', '', { expires: expireDate });
      document.cookie = cookie.serialize('userId', '', { expires: expireDate });
      document.cookie = cookie.serialize('username', '', { expires: expireDate });
      document.cookie = cookie.serialize('profilePhotoUrl', '', { expires: expireDate });
      document.cookie = cookie.serialize('email', '', { expires: expireDate });
      document.cookie = cookie.serialize('created', '', { expires: expireDate });
      return assign({}, state, {
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
