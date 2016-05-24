'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/NewsFeed.css');
}

export default class NewsFeed extends Component {
  static propTyes = {
    newsFeed: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    like: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    getLikelist: PropTypes.func.isRequired,
    hasMorePosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired
  };

  render() {
    const { newsFeed, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist, hasMorePosts, loadMorePosts } = this.props;
    return (
      <div className="newsfeed-component">
        <Gallery
          posts={newsFeed.posts.feedPosts}
          postIds={newsFeed.posts.feedIds}
          maxWidth={500}
          ratio={2}
          userId={userId}
          like={like}
          followUser={followUser}
          unfollowUser={unfollowUser}
          likePost={likePost}
          unlikePost={unlikePost}
          getLikelist={getLikelist}
          hasMorePosts={hasMorePosts}
          loadMorePosts={loadMorePosts}
          showAuthor={true}
        />
      </div>
    );
  }
}

NewsFeed.displayName = 'NewsFeed';
