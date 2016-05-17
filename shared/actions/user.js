import api from '../api';
import fetch from 'isomorphic-fetch';
import config from '../../etc/client-config.json';
import { push } from 'react-router-redux';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

function requestLogin() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

function loginSuccess(actionType, response) {
  return {
    type: actionType,
    response
  }
}

function loginError(message) {
  return {
    type: LOGIN_USER_FAILURE,
    message
  }
}

export function loginUser(creds, successRedirectUrl='/') {
  return (dispatch) => {
    if (!creds.email || !creds.password) {
      return dispatch(loginError('Missing Login Information'));
    }

    let init = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
    }
    dispatch(requestLogin());
    fetch(`${config.apiRoot}/users/login?include=user`, init).then((res) => {
      if (res.status >= 400) {
        dispatch(loginError(res.statusText));
        return null;
      }
      return res.json();
    }).then((data) => {
      if(data) {
        dispatch(loginSuccess(LOGIN_USER_SUCCESS, data));
        dispatch(push(successRedirectUrl));
      }
    }).catch((err) => {
      dispatch(loginError(err));
    });
  }
}

export const FACEBOOK_TOKEN_LOGIN_SUCCESS = 'FACEBOOK_TOKEN_LOGIN_SUCCESS';

export function facebookTokenLogin(token, successRedirectUrl='/') {
  return (dispatch) => {
    if (!token) {
      return dispatch(loginError('Missing Facebook Authentication Token'));
    }

    let init = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    dispatch(requestLogin());
    fetch(`${config.apiRoot}/users/auth/facebook/token?include=user`, init).then((res) => {
      if (res.status >= 400) {
        dispatch(loginError(res.statusText));
        return null;
      }
      return res.json();
    }).then((data) => {
      if(data) {
        dispatch(loginSuccess(FACEBOOK_TOKEN_LOGIN_SUCCESS, data));
        dispatch(push(successRedirectUrl));
      }
    }).catch((err) => {
      dispatch(loginError(err));
    });
  }
}

export const RESET_USER_ERROR_MESSAGE = 'RESET_USER_ERROR_MESSAGE';

export function resetErrMsg() {
  return (dispatch) => {
    dispatch({
      type: RESET_USER_ERROR_MESSAGE
    });
  }
}

export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';

function requestLogout() {
  return {
    type: LOGOUT_USER_REQUEST
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_USER_SUCCESS
  }
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    dispatch(receiveLogout());
  }
}

export const LOAD_USER_SUMMARY_REQUEST = 'LOAD_USER_SUMMARY_REQUEST';
export const LOAD_USER_SUMMARY_SUCCESS = 'LOAD_USER_SUMMARY_SUCCESS';
export const LOAD_USER_SUMMARY_FAILURE = 'LOAD_USER_SUMMARY_FAILURE';

export function loadUserSummary({id, params={}, authToken}) {
  return (dispatch) => {
    let queryId;
    if (id) {
      queryId = id;
    } else if (params.id) {
      queryId = params.id;
    }

    if (!queryId) {
      return dispatch({
        type: LOAD_USER_SUMMARY_FAILURE,
        error: 'No user id specified'
      });
    }

    dispatch({
      type: LOAD_USER_SUMMARY_REQUEST
    });

    return api.users.getProfile(queryId, authToken).then((response) => {
      dispatch({
        type: LOAD_USER_SUMMARY_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_USER_SUMMARY_FAILURE,
        error
      });
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export function followUser(followerId, followeeId) {
  return (dispatch) => {
    dispatch({
      type: FOLLOW_USER_REQUEST
    });
    return api.users.follow(followerId, followeeId).then(() => {
      dispatch({
        type: FOLLOW_USER_SUCCESS,
        followerId,
        followeeId
      });
    }).catch((error) => {
      dispatch({
        type: FOLLOW_USER_FAILURE,
        error
      });
    });
  }
}

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export function unfollowUser(followerId, followeeId) {
  return (dispatch) => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST
    });
    return api.users.unfollow(followerId, followeeId).then(() => {
      dispatch({
        type: UNFOLLOW_USER_SUCCESS,
        followeeId
      });
    }).catch((error) => {
      dispatch({
        type: UNFOLLOW_USER_FAILURE,
        error
      });
    });
  }
}

export const LIST_FOLLOWERS_REQUEST = 'LIST_FOLLOWERS_REQUEST';
export const LIST_FOLLOWERS_SUCCESS = 'LIST_FOLLOWERS_SUCCESS';
export const LIST_FOLLOWERS_FAILURE = 'LIST_FOLLOWERS_FAILURE';

export function listFollowers({id, params={}}) {
  const queryId = id ? id : params.id;
  return (dispatch) => {
    dispatch({
      type: LIST_FOLLOWERS_REQUEST
    });
    return api.users.listFollowers(queryId).then((response) => {
      dispatch({
        type: LIST_FOLLOWERS_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LIST_FOLLOWERS_FAILURE,
        error
      });
    });
  }
}

export const LIST_FOLLOWING_REQUEST = 'LIST_FOLLOWING_REQUEST';
export const LIST_FOLLOWING_SUCCESS = 'LIST_FOLLOWING_SUCCESS';
export const LIST_FOLLOWING_FAILURE = 'LIST_FOLLOWING_FAILURE';

export function listFollowing({id, params={}}) {
  const queryId = id ? id : params.id;
  return (dispatch) => {
    dispatch({
      type: LIST_FOLLOWING_REQUEST
    });
    return api.users.listFollowing(queryId).then((response) => {
      dispatch({
        type: LIST_FOLLOWING_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LIST_FOLLOWING_FAILURE,
        error
      });
    });
  }
}
