'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/Explorer.css');
}

export default class Explorer extends Component {
  static propTyes = {
    explorer: PropTypes.object.isRequired
  };

  render() {
    const { explorer } = this.props;
    return (
      <div className="explorer-component">
        <Gallery
          posts={explorer.posts.feedPosts}
          postIds={explorer.posts.feedIds}
          maxWidth={500}
          ratio={2}
          showAuthor={true}
        />
      </div>
    );
  }
}

Explorer.displayName = 'Explorer';
