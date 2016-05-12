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
    userId: PropTypes.string.isRequired,
    isRequestingFollow: PropTypes.bool.isRequired
  };

  hasMoreContent() {
    return this.props.explorer.recent.posts.hasNext;
  }

  loadMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.explorer.recent;
    dispatch(loadExploreRecent({
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    const { explorer, userId, like, isRequestingFollow } = this.props;
    return (
      <Explorer
        explorer={explorer.recent}
        userId={userId}
        like={like}
        isRequestingFollow={isRequestingFollow}
        followUser={this.follow}
        unfollowUser={this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
      >
        {this.props.children}
      </Explorer>
    );
  }
}

function mapStateToProps(state) {
  const { explorer, like } = state;
  const { userId } = state.user;
  // TODO: Please Fix: it is tricky to use state.person.isFetching to decide is user is requesting follow/unfollow now.
  const isRequestingFollow = state.person.isFetching;
  return {
    explorer,
    like,
    userId,
    isRequestingFollow
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ExplorerPageContainer, [ loadExploreRecent ])
);
