/* eslint react/no-did-mount-set-state: 0 */
import React, { Component, PropTypes } from 'react';

import HeaderContainer from '../../containers/layouts/Header.jsx';
import Content from './content/ContentComponent';
import Footer from './footer/FooterComponent';

if (process.env.BROWSER) {
  require('normalize.css');
  require('styles/MainLayout.css');
}

export default class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        <HeaderContainer />
          <Content>
            {this.props.children}
          </Content>
        <Footer />
      </div>
    );
  }
}
