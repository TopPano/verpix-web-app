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
