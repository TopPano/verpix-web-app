import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(id, authToken) {
    if (authToken) { this.apiClient.setAuthToken(authToken); }
    return this.apiClient.get({
      url: `users/${id}/profile`,
      authenticated: true
    });
  }
}
