'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/Explorer.css');
}

export default class Explorer extends Component {
  static propTyes = {
    explorer: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    like: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    getLikelist: PropTypes.func.isRequired
  };

  render() {
    const { explorer, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist } = this.props;
    return (
      <div className="explorer-component">
        <Gallery
          posts={explorer.posts.feedPosts}
          postIds={explorer.posts.feedIds}
          maxWidth={500}
          ratio={2}
          userId={userId}
          like={like}
          followUser={followUser}
          unfollowUser={unfollowUser}
          likePost={likePost}
          unlikePost={unlikePost}
          getLikelist={getLikelist}
          showAuthor={true}
        />
      </div>
    );
  }
}

Explorer.displayName = 'Explorer';
