'use strict';

import React, { Component, PropTypes } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('styles/UserMenu.css');
}

export default class UserMenu extends Component {
  constructor(props) {
    super(props);
  }

  hideMenu = () => {
    this.refs.overlayTrigger.hide();
  }

  handleClickGohome = () => {
    this.hideMenu();
  }

  handleClickLogout = () => {
    this.props.logoutUser();
    this.hideMenu();
  }

  render() {
    const { username, profilePhotoUrl, userId } = this.props;

    let popover =
      <Popover className='usermenu-popover'>
        <div className='usermenu-profile'>
          <img className='usermenu-profile-photo' src={profilePhotoUrl} />
          <span className='usermenu-profile-name'>{username}</span>
          <Link to={'@' + userId} onClick={this.handleClickGohome}><img className='usermenu-profile-gohome' src='/static/images/usermenu-gohome.png' /></Link>
        </div>
        <Link className='usermenu-logout' to={'/'} onClick={this.handleClickLogout}>{'LOG OUT'}</Link>
      </Popover>

    return (
      <OverlayTrigger
        ref='overlayTrigger'
        className='usermenu-component'
        trigger={'click'}
        rootClose
        placement={'bottom'}
        overlay={popover}
      >
        {this.props.children}
      </OverlayTrigger>
    );
  }
}

UserMenu.displayName = 'Button';

UserMenu.propTypes = {
  username: PropTypes.string.isRequired,
  profilePhotoUrl: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired
};
UserMenu.defaultProps = {
};

