'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/NewsFeed.css');
}

export default class NewsFeed extends Component {
  static propTyes = {
    newsFeed: PropTypes.object.isRequired
  };

  render() {
    const { newsFeed } = this.props;
    return (
      <div className="newsfeed-component">
        <Gallery
          posts={newsFeed.posts.feed}
          maxWidth={500}
          ratio={2}
          showProfilePhoto={true}
        />
      </div>
    );
  }
}

NewsFeed.displayName = 'NewsFeed';