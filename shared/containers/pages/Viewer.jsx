'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { connectDataFetchers } from '../../lib/utils';
import Viewer from '../../components/Pages/Viewer';
import { followUser, unfollowUser } from '../../actions/user';
import { getPost, likePost, unlikePost, showLikeList } from '../../actions/post';

import { sendEvent } from '../../lib/utils/googleAnalytics';

class ViewerPageContainer extends Component {
  static propTyes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching && nextProps.post) {
      sendEvent('viewer page', 'view', nextProps.post.mediaType);
    }
  }

  like = () => {
    const { dispatch } = this.props;
    const { postId } = this.props.params;
    const { userId, isAuthenticated } = this.props.user;
    if(isAuthenticated && userId) {
      dispatch(likePost(userId, postId));
      sendEvent('viewer page', 'like', this.props.post.mediaType);
    } else {
      sendEvent('viewer page', 'attempt to like', this.props.post.mediaType);
      this.gotoLoginPage();
    }
  }

  unlike = () => {
    const { dispatch } = this.props;
    const { postId } = this.props.params;
    const { userId, isAuthenticated } = this.props.user;
    if(isAuthenticated && userId) {
      dispatch(unlikePost(userId, postId));
      sendEvent('viewer page', 'unlike', this.props.post.mediaType);
    } else {
      this.gotoLoginPage();
    }
  }

  getLikelist = () => {
    const { dispatch } = this.props;
    const { postId } = this.props.params;
    const { userId, isAuthenticated } = this.props.user;
    if(isAuthenticated && userId) {
      dispatch(showLikeList(postId));
      sendEvent('viewer page', 'get like list', this.props.post.mediaType);
    } else {
      sendEvent('viewer page', 'attempt to get like list', this.props.post.mediaType);
      this.gotoLoginPage();
    }
  }

  follow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props.user;
    dispatch(followUser(userId, followeeId));
    sendEvent('viewer page', 'follow', this.props.post.mediaType);
  }

  unfollow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props.user;
    dispatch(unfollowUser(userId, followeeId));
    sendEvent('viewer page', 'unfollow', this.props.post.mediaType);
  }

  gotoLoginPage() {
    browserHistory.push('/');
  }

  render() {
    const { post, user, like } = this.props;
    return (
      <Viewer
        readyToPlay={this.props.params.postId === post.id}
        post={post}
        likelist={like}
        userId={user.userId}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
        followUser={this.follow}
        unfollowUser={this.unfollow}
      />
    );
  }
}

function mapStateToProps(state) {
  const { post, user, like } = state;
  return {
    post,
    user,
    like,
    isFetching: post.isFetching
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ViewerPageContainer, [ getPost ])
);
