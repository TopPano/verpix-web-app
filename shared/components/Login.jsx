'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/Login.css');
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInLogin: true
    }
  }

  static propTyes = {
    loginUser: PropTypes.func.isRequired
  };

  handleSubmitLogin = (e) => {
    e.preventDefault();
    const email = this.refs.loginEmail.value.trim();
    const password = this.refs.loginPass.value.trim();
    this.props.loginUser(email, password);
  }

  handleSubmitJoin = (e) => {
    e.preventDefault();
  }

  gotoJoin = (e) => {
    e.preventDefault();
    this.setState({
      isInLogin: false
    });
  }

  render() {
    return (
      <div className='login-component'>
        <div className='login-wrapper'>
          {this.state.isInLogin ?
            <div className='login-main'>
              <button className='login-facebook'>Log in with Facebook</button>
              <div className='login-text'>or Log in with email</div>
              <form className='login-form' onSubmit={this.handleSubmitLogin}>
                <input type='email' ref='loginEmail' placeholder='email' />
                <input type='password' ref='loginPass' placeholder='password' />
                <button className='login-submit' type='submit'>LOG IN</button>
              </form>
              <button className='login-goto-join' onClick={this.gotoJoin}>JOIN NOW</button>
            </div> :
            <div className='join-main'>
              <button className='login-facebook'>Join with Facebook</button>
              <div className='login-text'>or Join with email</div>
              <form className='login-form' onSubmit={this.handleSubmitJoin}>
                <input type='text' ref='joinName' placeholder='username' />
                <input type='email' ref='joinEmail' placeholder='email' />
                <input type='password' ref='loginPass' placeholder='password' />
                <input type='password' ref='loginPassAgain' placeholder='retype password' />
                <button className='login-submit' type='submit'>JOIN</button>
              </form>
            </div>
          }
        </div>
      </div>
    );
  }
}

Login.displayName = 'Login';
