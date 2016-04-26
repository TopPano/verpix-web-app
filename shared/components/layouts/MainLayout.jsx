/* eslint react/no-did-mount-set-state: 0 */
import React, { Component, PropTypes } from 'react';

import Header from './header/HeaderComponent';
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
        <Header />
          <Content>
            {this.props.children}
          </Content>
        <Footer />
      </div>
    );
  }
}
