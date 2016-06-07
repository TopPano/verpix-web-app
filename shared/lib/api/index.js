import ApiClient from './ApiClient';
import UsersAPI from './Users';
import PostsAPI from './Posts';

function apiFactory() {
  const api = new ApiClient();

  return {
    users: new UsersAPI({ apiClient: api }),
    posts: new PostsAPI({ apiClient: api })
  };
}

export default apiFactory();
