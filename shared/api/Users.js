import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(id, authToken) {
    this.apiClient.setAuthToken(authToken);
    return this.apiClient.get(`users/${id}/profile`);
  }
}
