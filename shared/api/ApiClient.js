import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import Promise from 'bluebird';

import config from '../../etc/client-config.json';

export default class ApiClient {

  get(requestUrl, params={}) {
    return this.request({
      url: requestUrl,
      method: 'get',
      params
    });
  }

  post(requestUrl, payload={}) {
    return this.request({
      url: requestUrl,
      method: 'post',
      body: payload
    });
  }

  put(requestUrl, payload={}) {
    return this.request({
      url: requestUrl,
      method: 'put',
      body: payload
    });
  }

  delete(requestUrl) {
    return this.request({
      url: requestUrl,
      method: 'delete'
    });
  }

  request({ url, method, params={}, body }) {
    if (this.authToken) {
      /* eslint-disable */
      params.access_token = this.authToken;
      /* eslint-enable */
    }

    const urlWithQuery = `${url}?${queryString.stringify(params)}`;

    const init = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (method !== 'get' && method !== 'head') {
      init.body = JSON.stringify(body);
    }

    return fetch(`${config.apiRoot}/${urlWithQuery}`, init).then(res => {
      if (res.status >= 400) {
        throw new Error('Bad response from server');
      }

      return res.json();
    }).then(data => {
      if (data && !data.error) {
        return data;
      }

      return Promise.reject(data.error);
    });
  }

  setAuthToken(authToken) {
    this.authToken = authToken;
  }
}
