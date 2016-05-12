'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from '../../components/Login';
import { loginUser } from '../../actions/user';

class LoginPageContainer extends Component {
  login = (email, password) => {
    this.props.dispatch(loginUser({email, password}));
  }

  render() {
    return (
      <Login loginUser={this.login} />
    );
  }
}

export default connect()(LoginPageContainer);
