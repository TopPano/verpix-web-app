'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../../components/layouts/header/HeaderComponent';
import { logoutUser } from '../../actions/user';

class HeaderContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  logout = (dispatch) => {
    dispatch(logoutUser());
  }

  render() {
    const { username, userId, profilePhotoUrl } = this.props.user;
    return (
      <Header
        username={username}
        userId={userId}
        profilePhotoUrl={profilePhotoUrl}
        logoutUser={this.logout.bind(this, this.props.dispatch)}
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

export default connect(mapStateToProps)(HeaderContainer);
