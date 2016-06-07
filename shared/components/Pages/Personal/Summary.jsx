'use strict';

import React, { Component, PropTypes } from 'react';

import { parseUsername, parseProfilePhotoUrl } from '../../../lib/utils';
import Counter from '../../Common/Counter';
import Button from '../../Common/Button';
import PhotoUploader from './PhotoUploader';
import Profile from './Profile';

if (process.env.BROWSER) {
  require('./Summary.css');
}

export default class Summary extends Component {
  genFollowingList() {
    const people = this.props.person.following;
    return this.genPeopleList(people, 'following')
  }

  genFollowerList() {
    const people = this.props.person.followers;
    return this.genPeopleList(people, 'follower')
  }

  genPeopleList(people, type) {
    let list = [];

    for(let id in people) {
      const who = people[id][type];
      if(who) {
        const { isFriend } = people[id];
        const username = parseUsername(who);
        const profilePhotoUrl = parseProfilePhotoUrl(who);
        list.push({
          username,
          profilePhotoUrl,
          id,
          isFriend
        });
      }
    }

    return list;
  }

  render() {
    const { username, profilePhotoUrl, postNum, followerNum, followingNum, isFollowing, id } = this.props.person;
    const { userId, followUser, unfollowUser } = this.props;
    // userId: id of logged-in user, id: id of the person of current page.
    const isMyself = (userId === id);
    const followerList = this.genFollowerList();
    const followingList = this.genFollowingList();

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
                showList={true}
                list={followerList}
                userId={userId}
                followUser={followUser}
                unfollowUser={unfollowUser}
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
                showList={true}
                list={followingList}
                userId={userId}
                followUser={followUser}
                unfollowUser={unfollowUser}
              />
              {isMyself ?
                <PhotoUploader /> :
                <Button
                  isClicked={ isFollowing }
                  textIsUnclicked={ 'follow' }
                  textIsClicked={ 'unfollow' }
                  handleWhenIsUnclicked={ followUser.bind(this, id) }
                  handleWhenIsClicked={ unfollowUser.bind(this, id) }
                />
              }
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
  person: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

// SummaryComponent.defaultProps = {};
