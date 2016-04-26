'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/personal/Profile.css');
}

export default class Profile extends Component {

  render() {
    return (
      <div className='personal-profile-component'>
        <img className='personal-profile-picture' src={ this.props.profilePhotoUrl } alt='profile picture' />
        <img className='personal-profile-upload' src='/static/images/personal/personal-profile-upload.png' alt='upload profile picture' />
      </div>
    );
  }
}

Profile.displayName = 'Profile';

Profile.propTypes = {
  profilePhotoUrl: PropTypes.string
};
Profile.defaultProps = {
  initialProfileUrl: '/static/images/personal/profile-default.png'
};

