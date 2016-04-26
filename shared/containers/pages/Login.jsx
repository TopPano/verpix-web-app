'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';

import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE
} from '../../actions/user';
import config from '../../../etc/client-config.json';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.pass.value;

    if (!email || !password) {
      return this.props.dispatch({
        type: LOGIN_USER_FAILURE,
        error: 'Missing login information'
      });
    }

    this.props.dispatch({
      type: LOGIN_USER_REQUEST
    });

    const init = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    };

    fetch(`${config.apiRoot}/users/login`, init).then((res) => {
      if (res.status >= 400) {
        return this.props.dispatch({
          type: LOGIN_USER_FAILURE
        });
      }

      return res.json();
    }).then((data) => {
      this.props.dispatch({
        type: LOGIN_USER_SUCCESS,
        response: data
      });
      //this.props.router.replace(`/@${data.userId}`);
      this.props.history.pushState(null, `/@${data.userId}`);
    });
  }

  handleChange(event) {
    this.setState({email: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          <input ref="email" placeholder="email" value={this.state.email} defaultValue="joe@example.com"
            onChange={this.handleChange.bind(this)} />
        </label>
        <label>
          <input ref="pass" placeholder="password" />
        </label> (hint: password1)<br />
        <button type="submit">login</button>
      </form>
    );
  }
}

Login.displayName = 'Login';

export default connect()(Login);
