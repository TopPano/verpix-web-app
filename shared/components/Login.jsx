'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/Login.css');
}

export default class Login extends Component {
  static propTyes = {
    loginUser: PropTypes.func.isRequired
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.refs.email.value.trim();
    const password = this.refs.pass.value.trim();
    this.props.loginUser(email, password);
  }

  render() {
    return (
      <div className='login-component'>
        <div className='login-wrapper'>
          <div className='login-main'>
            <button className='login-facebook'>Log in with Facebook</button>
            <div className='login-text'>or Log in with email</div>
            <form className='login-form' onSubmit={this.handleSubmit}>
              <input type='email' ref='email' placeholder='email' />
              <input type='password' ref='pass' placeholder='password' />
              <button className='login-submit' type='submit'>LOG IN</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.displayName = 'Login';
