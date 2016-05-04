import Base from './Base';

export default class PostsAPI extends Base {
  getUserPosts(userId, lastPostId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }

    let query = {};
    if (lastPostId) {
      query.where = {
        sid: {
          lt: lastPostId
        }
      }
    }

    return this.apiClient.post({
      url: `users/${userId}/profile/query`,
      payload: query,
      authenticated: true
    });
  }

  queryPosts(userId, lastPostId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }

    let query = {};
    if (lastPostId) {
      query.where = {
        sid: {
          lt: lastPostId
        }
      }
    }

    return this.apiClient.post({
      url: `users/${userId}/query`,
      payload: query,
      authenticated: true
    });
  }
}
