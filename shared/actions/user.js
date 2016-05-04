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

function loginSuccess(user) {
  return {
    type: LOGIN_USER_SUCCESS,
    user
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
        return dispatch(loginError(res.statusText));
      }
      return res.json();
    }).then((data) => {
      dispatch(loginSuccess(data));
      dispatch(push(successRedirectUrl));
    }).catch((err) => {
      dispatch(loginError(err));
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
