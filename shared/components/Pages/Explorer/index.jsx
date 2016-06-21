'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from 'components/Common/Gallery';

if (process.env.BROWSER) {
  require('./Explorer.css');
}

const propTypes = {
  explorer: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  like: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired
};

const defaultProps = {
}

class Explorer extends Component {
  render() {
    const { explorer, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist, loadMorePosts } = this.props;
    return (
      <div className="explorer-component">
        <Gallery
          posts={explorer.posts.feedPosts}
          postIds={explorer.posts.feedIds}
          hasNext={explorer.posts.hasNext}
          userId={userId}
          like={like}
          followUser={followUser}
          unfollowUser={unfollowUser}
          likePost={likePost}
          unlikePost={unlikePost}
          getLikelist={getLikelist}
          loadMorePosts={loadMorePosts}
          showAuthor={true}
        />
      </div>
    );
  }
}

Explorer.propTypes = propTypes;
Explorer.defaultProps = defaultProps;

export default Explorer;
