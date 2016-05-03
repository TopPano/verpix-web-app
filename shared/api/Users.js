import Base from './Base';

export default class UsersAPI extends Base {
  getProfile(id) {
    return this.apiClient.get({
      url: `users/${id}/profile`,
      authenticated: true
    });
  }
}
