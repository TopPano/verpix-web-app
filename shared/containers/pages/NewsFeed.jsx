'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';
import ScrollablePageContainer from './Scrollable';
import NewsFeed from '../../components/Pages/NewsFeed';

class NewsFeedPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    newsFeed: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
  };

  hasMoreContent = () => {
    return this.props.newsFeed.posts.hasNext;
  }

  isFetchingContent() {
    return this.props.newsFeed.isFetching;
  }

  requestMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.newsFeed;
    dispatch(loadNewsFeed({
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    const { newsFeed, userId, like } = this.props;
    return (
      <NewsFeed
        newsFeed={newsFeed}
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
      </NewsFeed>
    );
  }
}

function mapStateToProps(state) {
  const { newsFeed, like } = state;
  const { userId } = state.user;
  return {
    newsFeed,
    like,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(NewsFeedPageContainer, [ loadNewsFeed ])
);
