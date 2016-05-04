import Base from './Base';

export default class PostsAPI extends Base {
  getUserPosts(userId, lastPostId) {
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

  queryPosts(userId, lastPostId) {
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
