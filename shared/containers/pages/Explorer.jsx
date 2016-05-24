'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadExploreRecent } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import Explorer from '../../components/Explorer.jsx';

class ExplorerPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    explorer: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  hasMoreContent = () => {
    return this.props.explorer.recent.posts.hasNext;
  }

  isFetchingContent() {
    return this.props.explorer.recent.isFetching;
  }

  requestMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.explorer.recent;
    dispatch(loadExploreRecent({
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    const { explorer, userId, like } = this.props;
    return (
      <Explorer
        explorer={explorer.recent}
        userId={userId}
        like={like}
        followUser={this.follow}
        unfollowUser={this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
        hasMorePosts={this.hasMoreContent}
        loadMorePosts={this.loadMoreContent}
      >
        {this.props.children}
      </Explorer>
    );
  }
}

function mapStateToProps(state) {
  const { explorer, like } = state;
  const { userId } = state.user;
  return {
    explorer,
    like,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ExplorerPageContainer, [ loadExploreRecent ])
);
