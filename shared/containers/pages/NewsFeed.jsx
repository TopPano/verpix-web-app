'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';
import { likePost, unlikePost } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import NewsFeed from '../../components/NewsFeed.jsx';

class NewsFeedPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    newsFeed: PropTypes.object.isRequired
  };

  hasMoreContent() {
    return this.props.newsFeed.posts.hasNext;
  }

  loadMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.newsFeed;
    dispatch(loadNewsFeed({
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
      <NewsFeed
        newsFeed={this.props.newsFeed}
        likePost={this.like}
        unlikePost={this.unlike}
      >
        {this.props.children}
      </NewsFeed>
    );
  }
}

function mapStateToProps(state) {
  const { newsFeed } = state;
  const { userId } = state.user;
  return {
    newsFeed,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(NewsFeedPageContainer, [ loadNewsFeed ])
);
