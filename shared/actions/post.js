import api from '../api';
import { push } from 'react-router-redux';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export function loadUserPosts({userId, lastPostId, params={}}) {
  return (dispatch) => {
    let queryId;
    if (userId) {
      queryId = userId;
    } else if (params.id) {
      queryId = params.id;
    }

    if (!queryId) {
      return dispatch({
        type: LOAD_USER_POSTS_FAILURE,
        error: 'No user id specified'
      });
    }

    dispatch({
      type: LOAD_USER_POSTS_REQUEST
    });

    return api.posts.getUserPosts(queryId, lastPostId).then((response) => {
      response.result.firstQuery = lastPostId ? false : true;
      dispatch({
        type: LOAD_USER_POSTS_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_USER_POSTS_FAILURE,
        error
      });
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}

export const LOAD_NEWSFEED_REQUEST = 'LOAD_NEWSFEED_REQUEST';
export const LOAD_NEWSFEED_SUCCESS = 'LOAD_NEWSFEED_SUCCESS';
export const LOAD_NEWSFEED_FAILURE = 'LOAD_NEWSFEED_FAILURE';

export function loadNewsFeed({lastPostId}) {
  return (dispatch, getState) => {
    const { user: { userId } } = getState();

    if (!userId) {
      return dispatch({
        type: LOAD_NEWSFEED_FAILURE,
        error: 'User Not Found'
      });
    }

    dispatch({
      type: LOAD_NEWSFEED_REQUEST
    });

    return api.posts.queryPosts(userId, lastPostId).then((response) => {
      dispatch({
        type: LOAD_NEWSFEED_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_NEWSFEED_FAILURE,
        error
      });
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}

