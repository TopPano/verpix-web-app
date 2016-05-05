import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(id, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.get({
      url: `users/${id}/profile`,
      authenticated: true
    });
  }

  follow(followerId, followeeId) {
    return this.apiClient.post({
      url: `users/${followerId}/follow/${followeeId}`,
      authenticated: true
    });
  }

  unfollow(followerId, followeeId) {
    return this.apiClient.post({
      url: `users/${followerId}/unfollow/${followeeId}`,
      authenticated: true
    });
  }
}
