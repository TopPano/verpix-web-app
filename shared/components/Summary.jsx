'use strict';

import React, { Component, PropTypes } from 'react';
import Counter from './Counter';
import Button from './Button';
import Profile from './Profile';

if (process.env.BROWSER) {
  require('styles/personal/Summary.css');
}

export default class Summary extends Component {

  render() {
    const { username, profilePhotoUrl, postNum, followerNum, followingNum } = this.props.user;

    return (
      <div className='personal-summary-component'>
        <div className='personal-summary-fg' />
        <div className='personal-summary-main container-fluid'>
          <div className='personal-summary-profilebg' />
          <div className='personal-summary-profile'>
            <div className='personal-summary-profile-left'>
              <Counter
                icon={ '/static/images/personal/personal-counter-post.png' }
                count={postNum}
              />
              <Counter
                icon={ '/static/images/personal/personal-counter-like.png' }
                count={followerNum}
              />
            </div>
            <Profile
              profilePhotoUrl={profilePhotoUrl}
            />
            <div className='personal-summary-profile-right'>
              <Counter
                icon={ '/static/images/personal/personal-counter-follower.png' }
                iconPosition={ 'counter-right' }
                count={followingNum}
              />
              <Button
                initialIsClicked={ false }
                text={ 'follow' }
                textClicked={ 'unfollow' }
              />
            </div>
          </div>
          <div className='personal-summary-name'>{username}</div>
        </div>
      </div>
    );
  }
}

Summary.displayName = 'Summary';

Summary.propTypes = {
  user: PropTypes.object.isRequired
};
// SummaryComponent.defaultProps = {};
