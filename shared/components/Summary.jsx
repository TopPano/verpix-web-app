'use strict';

import React, { Component, PropTypes } from 'react';
import Counter from './Counter';
import Button from './Button';
import PhotoUploader from './PhotoUploader';
import Profile from './Profile';

if (process.env.BROWSER) {
  require('styles/personal/Summary.css');
}

export default class Summary extends Component {

  render() {
    const { name, profilePhotoUrl, postNum, followerNum, followingNum, isFollowing, id } = this.props.person;
    const isMyself = (this.props.userId === id);

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
              {isMyself ?
                <PhotoUploader /> :
                <Button
                  isClicked={ isFollowing }
                  textIsUnclicked={ 'follow' }
                  textIsClicked={ 'unfollow' }
                  handleWhenIsUnclicked={ this.props.followUser }
                  handleWhenIsClicked={ this.props.unfollowUser }
                />
              }
            </div>
          </div>
          <div className='personal-summary-name'>{name}</div>
        </div>
      </div>
    );
  }
}

Summary.displayName = 'Summary';

Summary.propTypes = {
  person: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

// SummaryComponent.defaultProps = {};
