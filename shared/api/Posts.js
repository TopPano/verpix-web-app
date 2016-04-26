import Base from './Base';

export default class PostsAPI extends Base {
  getUserPosts(userId, lastPostId, authToken) {
    this.apiClient.setAuthToken(authToken);
    let query = {};
    if (lastPostId) {
      query.where = {
        sid: {
          lt: lastPostId
        }
      }
    }
    return this.apiClient.post(`users/${userId}/profile/query`, query);
  }
}
