'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from '../../components/layouts/header/HeaderComponent';

class HeaderContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  render() {
    return (
      <Header
        username={this.props.user.username}
        userId={this.props.user.userId}
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
