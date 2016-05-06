'use strict';

import React, { Component, PropTypes } from 'react';

import UserMenu from '../../UserMenu.jsx';

if (process.env.BROWSER) {
  require('styles/layout/header/List.css');
}

class ListComponent extends Component {
  render() {
    const { username } = this.props;
    return (
      <div className="header-list-component">
        {username &&
          <UserMenu {...this.props}>
            <div className="header-list-username">{username}</div>
          </UserMenu>
        }
      </div>
    );
  }
}

ListComponent.displayName = 'LayoutHeaderListComponent';

ListComponent.propTypes = {
  username: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired
};
ListComponent.defaultProps = {
};

export default ListComponent;
