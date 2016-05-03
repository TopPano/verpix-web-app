import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import Promise from 'bluebird';
import isEmpty from 'lodash/isEmpty';
import auth from '../lib/auth';

import config from '../../etc/client-config.json';

export default class ApiClient {

  get({url, params={}, authenticated=false}) {
    return this.request({
      url,
      method: 'get',
      params,
      authenticated
    });
  }

  post({url, payload={}, authenticated=false}) {
    return this.request({
      url,
      method: 'post',
      body: payload,
      authenticated
    });
  }

  put({url, payload={}, authenticated=false}) {
    return this.request({
      url,
      method: 'put',
      body: payload,
      authenticated
    });
  }

  delete({url, authenticated=false}) {
    return this.request({
      url,
      method: 'delete',
      authenticated
    });
  }

  request({ url, method, params={}, body={}, authenticated }) {
    const urlWithQuery = isEmpty(params) ? `${url}` : `${url}?${queryString.stringify(params)}`;
    const init = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (authenticated) {
      let token = auth.getToken();
      if (token) {
        init.headers['Authorization'] = `${token}`;
      } else {
        let error = new Error('No access token saved!');
        error.status = 401;
        return Promise.reject(error);
      }
    }

    if (method !== 'get' && method !== 'head') {
      init.body = JSON.stringify(body);
    }

    return fetch(`${config.apiRoot}/${urlWithQuery}`, init).then((res) => {
      if (res.status >= 400) {
        return Promise.reject({ status: res.status, message: res.statusText });
      }
      return res.json();
    }).then((data) => {
      if (data && !data.error) {
        return data;
      }
      return Promise.reject(data.error);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
}
