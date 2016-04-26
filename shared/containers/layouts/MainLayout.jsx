/* eslint react/no-did-mount-set-state: 0 */

import React, { Component, PropTypes } from 'react';

import MainLayout from '../../components/layouts/MainLayout.jsx';

export default class MainLayoutContainer extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <MainLayout>
        {this.props.children}
      </MainLayout>
    );
  }
}
