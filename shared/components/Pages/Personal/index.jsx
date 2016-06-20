'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary';
import Gallery from 'components/Common/Gallery';

if (process.env.BROWSER) {
  require('./Personal.css');
}

const propTypes = {
  person: PropTypes.object.isRequired,
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

class Personal extends Component {
  render() {
    const { person, like, userId, likePost, unlikePost, followUser, unfollowUser, getLikelist, hasMorePosts, loadMorePosts } = this.props;
    return (
      <div className="personal-component">
        <Summary {...this.props} />
        <Gallery
          posts={person.posts.feedPosts}
          postIds={person.posts.feedIds}
          hasNext={person.posts.hasNext}
          userId={userId}
          like={like}
          followUser={followUser}
          unfollowUser={unfollowUser}
          likePost={likePost}
          unlikePost={unlikePost}
          getLikelist={getLikelist}
          hasMorePosts={hasMorePosts}
          loadMorePosts={loadMorePosts}
        />
      </div>
    );
  }
}

Personal.propTypes = propTypes;
Personal.defaultProps = defaultProps;

export default Personal;
