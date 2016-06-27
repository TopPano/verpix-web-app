import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  GET_POST_REQUEST,
  GET_POST_SUCCESS,
  GET_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE
} from '../actions/post';

const DEFAULT_STATE = {
  isFetching: false,
  id: undefined,
  dimension: {},
  thumbnail: {},
  mediaType: undefined,
  media: {},
  caption: '',
  likes: {},
  created: undefined,
  modified: undefined,
  owner: {
    identities: []
  },
  location: {}
};

export default function post(state=DEFAULT_STATE, action) {
  let nextState = {};
  switch (action.type) {
    case GET_POST_REQUEST:
    case LIKE_POST_REQUEST:
    case UNLIKE_POST_REQUEST:
      return merge({}, state, {
        isFetching: true
      });
    case GET_POST_SUCCESS:
      const { sid, dimension, thumbnail, mediaType, media, caption, likes, created, modified, owner, location } = action.response.result;
      return assign({}, state, {
        isFetching: false,
        id: sid,
        dimension,
        thumbnail,
        mediaType,
        media,
        caption,
        likes,
        created,
        modified,
        owner,
        location
      });
    case LIKE_POST_SUCCESS:
      nextState = { isFetching: false };
      if (state.id === action.id) {
        nextState = merge(nextState, {
          likes: {
            count: state.likes.count + 1,
            isLiked: true
          }
        });
      }
      return merge({}, state, nextState);
    case UNLIKE_POST_SUCCESS:
      nextState = { isFetching: false };
      if (state.id === action.id) {
        nextState = merge(nextState, {
          likes: {
            count: state.likes.count - 1,
            isLiked: false
          }
        });
      }
      return merge({}, state, nextState);
    case GET_POST_FAILURE:
    case LIKE_POST_FAILURE:
    case UNLIKE_POST_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
