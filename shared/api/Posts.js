import Base from './Base';

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
      authenticated: true
    });
  }

  getNewsFeed(userId, lastPostId, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.post({
      url: `users/${userId}/query`,
      payload: genQuery(lastPostId),
      authenticated: true
    });
  }

  exploreRecent(lastPostId) {
    return this.apiClient.post({
      url: 'search/recent',
      payload: genQuery(lastPostId),
      authenticated: true
    });
  }
}
