import api from '../api';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export function loadUserPosts({userId, lastPostId, params={}}) {
  return (dispatch, getState) => {
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

    let { auth: { token } } = getState().user;
    return api.posts.getUserPosts(queryId, lastPostId, token).then((response) => {
      dispatch({
        type: LOAD_USER_POSTS_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_USER_POSTS_FAILURE,
        error
      });
    });
  };
}
