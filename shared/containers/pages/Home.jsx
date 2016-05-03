'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LoginPageContainer from './Login.jsx';

class Home extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  render() {
    const { isAuthenticated, username } = this.props.user;
    return (
      <div>
        {isAuthenticated &&
          <h1>Welcome to Verpix world!</h1>
        }
        {!isAuthenticated &&
          <LoginPageContainer>
            {this.props.children}
          </LoginPageContainer>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps)(Home);
