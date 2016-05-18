/* eslint react/no-did-mount-set-state: 0 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MainLayout from '../../components/layouts/MainLayout.jsx';

class MainLayoutContainer extends Component {
  static propTypes = {
    children: PropTypes.object,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return (
      <MainLayout
        isAuthenticated={this.props.isAuthenticated}
        currentLocation={this.props.location.pathname}
      >
        {this.props.children}
      </MainLayout>
    );
  }
}

function mapStateToProps(state) {
  const { isAuthenticated } = state.user;
  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps)(MainLayoutContainer);
