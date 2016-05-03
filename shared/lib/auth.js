import cookie from 'cookie';

class Auth {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return process.env.BROWSER ? cookie.parse(document.cookie).accessToken : this.token;
  }

  isAuthenticated() {
    let isAuthenticated = false;
    if (process.env.BROWSER) {
      if (cookie.parse(document.cookie).accessToken) {
        isAuthenticated = true;
      }
    } else {
      if (this.token) {
        isAuthenticated = true;
      }
    }
    return isAuthenticated;
  }
}

function authFactory() {
  return new Auth();
}

export default authFactory();

