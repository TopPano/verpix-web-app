import merge from 'lodash/merge';
import assign from 'lodash/assign';
import {
  GET_POST_REQUSET,
  GET_POST_SUCCESS,
  GET_POST_FAILURE
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
  owner: {},
  location: {}
};

export default function post(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_POST_REQUSET:
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
    case GET_POST_FAILURE:
      return merge({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
