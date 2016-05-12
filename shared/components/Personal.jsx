'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary.jsx';
import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/personal/Personal.css');
}

export default class Personal extends Component {
  static propTyes = {
    person: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    like: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    getLikelist: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired
  };

  render() {
    const { person, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist, loadMorePosts } = this.props;
    return (
      <div className="personal-component">
        <Summary {...this.props} />
        <Gallery
          posts={person.posts.feedPosts}
          postIds={person.posts.feedIds}
          maxWidth={500}
          ratio={2}
          userId={userId}
          like={like}
          followUser={followUser}
          unfollowUser={unfollowUser}
          likePost={likePost}
          unlikePost={unlikePost}
          getLikelist={getLikelist}
          loadMorePosts={loadMorePosts}
        />
      </div>
    );
  }
}

Personal.displayName = 'Personal';
