'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from '../../components/Login';
import { loginUser, facebookTokenLogin } from '../../actions/user';

class LoginPageContainer extends Component {
  login = (email, password) => {
    this.props.dispatch(loginUser({email, password}));
  }

  facebookLogin = (token) => {
    this.props.dispatch(facebookTokenLogin(token));
  }

  render() {
    return (
      <Login loginUser={this.login} facebookLogin={this.facebookLogin} />
    );
  }
}

export default connect()(LoginPageContainer);
