'use strict';

import React, { Component, PropTypes } from 'react';

import Gallery from 'components/Common/Gallery';

if (process.env.BROWSER) {
  require('./NewsFeed.css');
}

const propTypes = {
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

const defaultProps = {
}

class NewsFeed extends Component {
  render() {
    const { newsFeed, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist, hasMorePosts, loadMorePosts } = this.props;
    return (
      <div className="newsfeed-component">
        <Gallery
          posts={newsFeed.posts.feedPosts}
          postIds={newsFeed.posts.feedIds}
          hasNext={newsFeed.posts.hasNext}
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

NewsFeed.propTypes = propTypes;
NewsFeed.defaultProps = defaultProps;

export default NewsFeed;
