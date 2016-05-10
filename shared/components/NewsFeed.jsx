'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/NewsFeed.css');
}

export default class NewsFeed extends Component {
  static propTyes = {
    newsFeed: PropTypes.object.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired
  };

  render() {
    const { newsFeed, likePost, unlikePost } = this.props;
    return (
      <div className="newsfeed-component">
        <Gallery
          posts={newsFeed.posts.feedPosts}
          postIds={newsFeed.posts.feedIds}
          maxWidth={500}
          ratio={2}
          showAuthor={true}
          likePost={likePost}
          unlikePost={unlikePost}
        />
      </div>
    );
  }
}

NewsFeed.displayName = 'NewsFeed';
