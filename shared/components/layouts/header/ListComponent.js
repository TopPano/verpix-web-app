'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import UserMenu from '../../UserMenu.jsx';

if (process.env.BROWSER) {
  require('styles/layout/header/List.css');
}

class ListComponent extends Component {
  render() {
    const isLogin = this.props.username ? true : false;
    return (
      <div className='list-component'>
        {isLogin &&
          <div className='list-wrapper'>
            <Link to={'/'} className='list-item-wrapper'>
              <img src='/static/images/header/home.png' className='list-item' />
            </Link>
            <Link to={'/explore'} className='list-item-wrapper'>
              <img src='/static/images/header/explorer.png' className='list-item' />
            </Link>
            <div className='list-item-wrapper'>
              <UserMenu {...this.props}>
                <img src='/static/images/header/account.png' className='list-item' />
              </UserMenu>
            </div>
          </div>
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
