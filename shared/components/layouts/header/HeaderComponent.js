'use strict';

import React, { Component, PropTypes } from 'react';
import Brand from './Brand';
import List from './ListComponent.js';

if (process.env.BROWSER) {
  require('styles/layout/header/Header.css');
}

class HeaderComponent extends Component {
  render() {
    const isLogin = this.props.username ? true : false;
    return (
      <div className="header-component navbar-fixed-top">
        <Brand alwaysShow={!isLogin} />
        {isLogin &&
          <List {...this.props} />
        }
      </div>
    );
  }
}

HeaderComponent.displayName = 'LayoutHeaderHeaderComponent';

HeaderComponent.propTypes = {
  username: PropTypes.string,
  profilePhotoUrl: PropTypes.string,
  userId: PropTypes.string,
  logoutUser: PropTypes.func
};
HeaderComponent.defaultProps = {
};

export default HeaderComponent;
