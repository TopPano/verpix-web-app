'use strict';

import React, { Component, PropTypes } from 'react';
import FacebookLogin from 'react-facebook-login';
import merge from 'lodash/merge';
import trim from 'lodash/trim';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'is-empty';

import { LOGIN_ERR_MSG } from '../lib/const';

if (process.env.BROWSER) {
  require('styles/Login.css');
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInLogin: true,
      isInErr: false,
      errMsg: '',
      inputs: {
        loginEmail: '',
        loginPasswd: '',
        joinName: '',
        joinEmail: '',
        joinPasswd: '',
        joinPasswdAgain: ''
      }
    }
  }

  static propTyes = {
    user: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    facebookLogin: PropTypes.func.isRequired,
    cleanErrMsg: PropTypes.func.isRequired
  };

  componentDidUpdate() {
    const { errorMessage } = this.props.user;
    const { cleanErrMsg } = this.props;
    if(!this.state.isInErr && errorMessage) {
      cleanErrMsg();
      if(errorMessage === 'Unauthorized') {
        this.showErrMsg(LOGIN_ERR_MSG.AJAX.UNAUTHORIZD);
      } else {
        this.showErrMsg(LOGIN_ERR_MSG.AJAX.OTHERS);
      }
    }
  }

  handleInputChange = (input) => {
    this.setState(merge({}, this.state, {
      inputs: {
        [input]: trim(this.refs[input].value)
      }
    }));
  }

  handleFacebookLogin = (response) => {
    this.props.facebookLogin(response.accessToken);
  }

  handleSubmitLogin = (e) => {
    e.preventDefault();
    const { inputs } = this.state;
    const email = inputs.loginEmail;
    const passwd = inputs.loginPasswd;

    if(isEmpty(email)) {
      this.showErrMsg(LOGIN_ERR_MSG.EMAIL.EMPTY);
      return;
    }
    if(!isEmail(email)) {
      this.showErrMsg(LOGIN_ERR_MSG.EMAIL.INVALID);
      return;
    }
    if(isEmpty(passwd)) {
      this.showErrMsg(LOGIN_ERR_MSG.PASSWORD.EMPTY);
      return;
    }
    this.props.loginUser(email, passwd);
  }

  handleSubmitJoin = (e) => {
    e.preventDefault();
    const { inputs } = this.state;
    const name = inputs.joinName;
    const email = inputs.joinEmail;
    const passwd = inputs.joinPasswd;
    const passwdAgain = inputs.joinPasswdAgain;

    if(isEmpty(name)) {
      this.showErrMsg(LOGIN_ERR_MSG.USERNAME.EMPTY);
      return;
    }
    if(!this.isValidName(name)) {
      this.showErrMsg(LOGIN_ERR_MSG.USERNAME.INVALID);
      return;
    }
    if(isEmpty(email)) {
      this.showErrMsg(LOGIN_ERR_MSG.EMAIL.EMPTY);
      return;
    }
    if(!isEmail(email)) {
      this.showErrMsg(LOGIN_ERR_MSG.EMAIL.INVALID);
      return;
    }
    if(isEmpty(passwd) || isEmpty(passwdAgain)) {
      this.showErrMsg(LOGIN_ERR_MSG.PASSWORD.EMPTY);
      return;
    }
    if(passwd !== passwdAgain) {
      this.showErrMsg(LOGIN_ERR_MSG.PASSWORD.NOT_MATCHED);
      return;
    }
    // TODO: this.props.signupUser(name, email, passwd);
  }

  handleExitErr = (e) => {
    e.preventDefault();
    this.setState({
      isInErr: false
    });
  }

  gotoJoin = (e) => {
    e.preventDefault();
    this.setState({
      isInLogin: false
    });
  }

  showErrMsg = (msg) => {
    this.setState({
      isInErr: true,
      errMsg: msg
    });
  }

  isValidName(name) {
    const regex = new RegExp('[a-z]+((.|_)?[a-z0-9])+'),
          result = regex.exec(name);
    return result && result[0] === name;
  }

  render() {
    const { isInErr, isInLogin, inputs } = this.state;
    const fbBtn =
      <FacebookLogin
        appId='589634317860022'
        version={'2.6'}
        scope={'publish_actions'}
        callback={this.handleFacebookLogin}
        cssClass='login-facebook'
        textButton={isInLogin ? 'Log in with Facebook' : 'Join with Facebook'}
      />;
    const login =
      <div className='login-main'>
        {fbBtn}
        <div className='login-text'>or Log in with email</div>
        <form className='login-form' onSubmit={this.handleSubmitLogin}>
          <input type='email' ref='loginEmail' placeholder='Email' onChange={this.handleInputChange.bind(this, 'loginEmail')} value={inputs.loginEmail} />
          <input type='password' ref='loginPasswd' placeholder='Password' onChange={this.handleInputChange.bind(this, 'loginPasswd')} value={inputs.loginPasswd} />
          <button type='submit'>LOG IN</button>
        </form>
        <button className='login-goto-join' onClick={this.gotoJoin}>JOIN NOW</button>
      </div>;
    const join =
      <div className='join-main'>
        {fbBtn}
        <div className='login-text'>or Join with email</div>
        <form className='login-form' onSubmit={this.handleSubmitJoin}>
          <input type='text' ref='joinName' placeholder='Your name' onChange={this.handleInputChange.bind(this, 'joinName')} value={inputs.joinName} />
          <input type='email' ref='joinEmail' placeholder='Email' onChange={this.handleInputChange.bind(this, 'joinEmail')} value={inputs.joinEmail} />
          <input type='password' ref='joinPasswd' placeholder='Password' onChange={this.handleInputChange.bind(this, 'joinPasswd')} value={inputs.joinPasswd} />
          <input type='password' ref='joinPasswdAgain' placeholder='Confirm password' onChange={this.handleInputChange.bind(this, 'joinPasswdAgain')} value={inputs.joinPasswdAgain} />
          <button type='submit'>JOIN</button>
        </form>
      </div>;
    const err =
      <div className='err-main'>
        <form className='login-form' onSubmit={this.handleExitErr}>
          <div className='login-text'>{this.state.errMsg}</div>
          <button>GO BACK</button>
        </form>
      </div>;
    const output = isInErr ? err : (isInLogin ? login : join);

    return (
      <div className='login-component'>
        <div className='login-wrapper'>
          {output}
        </div>
      </div>
    );
  }
}

Login.displayName = 'Login';
