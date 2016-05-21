'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Login from '../../components/Login';
import { loginUser, facebookTokenLogin, registerUser, resetErrMsg } from '../../actions/user';

class LoginPageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  login = (email, password) => {
    this.props.dispatch(loginUser({email, password}));
  }

  facebookLogin = (token) => {
    this.props.dispatch(facebookTokenLogin(token));
  }

  join = (username, email, password) => {
    this.props.dispatch(registerUser({username, email, password}));
  }
  cleanErrMsg = () => {
    this.props.dispatch(resetErrMsg());
  }

  render() {
    return (
      <Login
        user={this.props.user}
        loginUser={this.login}
        facebookLogin={this.facebookLogin}
        joinUser={this.join}
        cleanErrMsg={this.cleanErrMsg}
      />
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps)(LoginPageContainer);
