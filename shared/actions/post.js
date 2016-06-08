import { push } from 'react-router-redux';

import api from 'lib/api';
import { DEFAULT_FOLLOWING_USER } from 'constants/common';
import { followUser } from './user';

export const GET_POST_REQUEST = 'GET_POST_REQUEST';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

export function getPost({postId, params={}}) {
  return (dispatch) => {
    dispatch({
      type: GET_POST_REQUEST
    });

    let queryId;
    if (postId) {
      queryId = postId;
    } else {
      queryId = params.postId;
    }
    if (!queryId) {

      return dispatch({
        type: GET_POST_REQUEST
      });
    }

    return api.posts.getPost(queryId).then((response) => {
      dispatch({
        type: GET_POST_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: GET_POST_FAILURE,
        error
      });
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export function loadUserPosts({userId, lastPostId, params={}, authToken}) {
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

    return api.posts.getUserPosts(queryId, lastPostId, authToken).then((response) => {
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

export function loadNewsFeed({lastPostId, authToken}) {
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

    return api.posts.getNewsFeed(userId, lastPostId, authToken).then((response) => {
      const firstQuery = lastPostId ? false : true;

      response.result.firstQuery = firstQuery;
      dispatch({
        type: LOAD_NEWSFEED_SUCCESS,
        response
      });

      if(firstQuery && response.result.result.feed.length === 0) {
        dispatch(followUser(userId, DEFAULT_FOLLOWING_USER, () => {
          dispatch(loadNewsFeed({}))
        }));
      }

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

export const LOAD_EXPLORE_RECENT_REQUEST = 'LOAD_EXPLORE_RECENT_REQUEST';
export const LOAD_EXPLORE_RECENT_SUCCESS = 'LOAD_EXPLORE_RECENT_SUCCESS';
export const LOAD_EXPLORE_RECENT_FAILURE = 'LOAD_EXPLORE_RECENT_FAILURE';

export function loadExploreRecent({lastPostId, authToken}) {
  return (dispatch) => {
    dispatch({
      type: LOAD_EXPLORE_RECENT_REQUEST
    });

    return api.posts.exploreRecent(lastPostId, authToken).then((response) => {
      response.result.firstQuery = lastPostId ? false : true;
      dispatch({
        type: LOAD_EXPLORE_RECENT_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: LOAD_EXPLORE_RECENT_FAILURE,
        error
      });
      if (error.status === 401) {
        dispatch(push('/'));
      }
    });
  };
}

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export function likePost(userId, postId) {
  return (dispatch) => {
    dispatch({
      type: LIKE_POST_REQUEST
    });
    return api.posts.likePost(userId, postId).then(() => {
      dispatch({
        type: LIKE_POST_SUCCESS,
        id: postId
      });
    }).catch((error) => {
      dispatch({
        type: LIKE_POST_FAILURE,
        error
      })
    });
  }
}

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export function unlikePost(userId, postId) {
  return (dispatch) => {
    dispatch({
      type: UNLIKE_POST_REQUEST
    });
    return api.posts.unlikePost(userId, postId).then(() => {
      dispatch({
        type: UNLIKE_POST_SUCCESS,
        id: postId
      });
    }).catch((error) => {
      dispatch({
        type: UNLIKE_POST_FAILURE,
        error
      })
    });
  }
}

export const SHOW_LIKE_LIST_REQUEST = 'SHOW_LIKE_LIST_REQUEST';
export const SHOW_LIKE_LIST_SUCCESS = 'SHOW_LIKE_LIST_SUCCESS';
export const SHOW_LIKE_LIST_FAILURE = 'SHOW_LIKE_LIST_FAILURE';

export function showLikeList(id) {
  return (dispatch) => {
    dispatch({
      type: SHOW_LIKE_LIST_REQUEST
    });
    return api.posts.getLikeList(id).then((response) => {
      dispatch({
        type: SHOW_LIKE_LIST_SUCCESS,
        response
      });
    }).catch((error) => {
      dispatch({
        type: SHOW_LIKE_LIST_FAILURE,
        error
      })
    });
  }
}
