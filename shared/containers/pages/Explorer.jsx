'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadExploreRecent } from '../../actions/post';
import { likePost, unlikePost } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import Explorer from '../../components/Explorer.jsx';

class ExplorerPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    explorer: PropTypes.object.isRequired
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

  like = (postId) => {
    const { dispatch } = this.props;
    const { userId } = this.props;
    dispatch(likePost(userId, postId));
  }

  unlike = (postId) => {
    const { dispatch } = this.props;
    const { userId } = this.props;
    dispatch(unlikePost(userId, postId));
  }

  render() {
    return (
      <Explorer
        explorer={this.props.explorer.recent}
        likePost={this.like}
        unlikePost={this.unlike}
      >
        {this.props.children}
      </Explorer>
    );
  }
}

function mapStateToProps(state) {
  const { explorer } = state;
  const { userId } = state.user;
  return {
    explorer,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ExplorerPageContainer, [ loadExploreRecent ])
);
