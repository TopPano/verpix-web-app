import Base from './Base';
import { Schema, arrayOf } from 'normalizr';

function genQuery(lastPostId) {
  let query = {};
  if (lastPostId) {
    query.where = {
      sid: {
        lt: lastPostId
      }
    }
  }
  return query;
}

export default class PostsAPI extends Base {
  getUserPosts(userId, lastPostId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.post({
      url: `users/${userId}/profile/query`,
      payload: genQuery(lastPostId),
      authenticated: true,
      schema: { result: { feed: arrayOf(new Schema('posts', { idAttribute: 'sid' })) }}
    });
  }

  getNewsFeed(userId, lastPostId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.post({
      url: `users/${userId}/query`,
      payload: genQuery(lastPostId),
      authenticated: true,
      schema: { result: { feed: arrayOf(new Schema('posts', { idAttribute: 'sid' })) }}
    });
  }

  exploreRecent(lastPostId) {
    return this.apiClient.post({
      url: 'search/recent',
      payload: genQuery(lastPostId),
      authenticated: true,
      schema: { result: { feed: arrayOf(new Schema('posts', { idAttribute: 'sid' })) }}
    });
  }

  likePost(userId, postId) {
    return this.apiClient.post({
      url: `posts/${postId}/like`,
      payload: { userId },
      authenticated: true
    });
  }

  unlikePost(userId, postId) {
    return this.apiClient.post({
      url: `posts/${postId}/unlike`,
      payload: { userId },
      authenticated: true
    });
  }

  getLikeList(id) {
    return this.apiClient.get({
      url: `posts/${id}/likes`,
      authenticated: true,
      schema: { result: arrayOf(new Schema('users', { idAttribute: 'userId' })) }
    });
  }
}
