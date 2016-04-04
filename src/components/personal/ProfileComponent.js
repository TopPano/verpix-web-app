'use strict';

import React from 'react';

require('styles/personal/Profile.css');

class ProfileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileUrl: props.initialProfileUrl
    };
  }
  render() {
    return (
      <div className='personal-profile-component'>
        <img className='personal-profile-picture' src={ this.state.profileUrl } alt='profile picture' />
        <img className='personal-profile-upload' src='../../images/personal/personal-profile-upload.png' alt='upload profile picture' />
      </div>
    );
  }
}

ProfileComponent.displayName = 'PersonalProfileComponent';

ProfileComponent.propTypes = {
  initialProfileUrl: React.PropTypes.string
};
ProfileComponent.defaultProps = {
  initialProfileUrl: '../../images/personal/profile-default.png'
};

export default ProfileComponent;
