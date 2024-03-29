'use strict';

import React, { Component, PropTypes } from 'react';
import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';

if (process.env.BROWSER) {
  require('./Profile.css');
}

export default class Profile extends Component {

  render() {
    return (
      <div className='personal-profile-component'>
        <img className='personal-profile-picture' src={ this.props.profilePhotoUrl } alt='profile picture' />
      </div>
    );
  }
}

Profile.displayName = 'Profile';

Profile.propTypes = {
  profilePhotoUrl: PropTypes.string
};
Profile.defaultProps = {
  initialProfileUrl: DEFAULT_PROFILE_PHOTO_URL
};

