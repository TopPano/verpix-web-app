import Base from './Base';
import { Schema, arrayOf } from 'normalizr';

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

  listFollowers(id) {
    return this.apiClient.get({
      url: `users/${id}/followers`,
      authenticated: true,
      schema: { result: arrayOf(new Schema('followerList', { idAttribute: 'followerId' })) }
    });
  }

  listFollowing(id) {
    return this.apiClient.get({
      url: `users/${id}/following`,
      authenticated: true,
      schema: { result: arrayOf(new Schema('followingList', { idAttribute: 'followeeId' })) }
    });
  }
}
