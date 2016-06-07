'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { connectDataFetchers } from '../../lib/utils';
import Viewer from '../../components/Pages/Viewer';
import { followUser, unfollowUser } from '../../actions/user';
import { getPost, likePost, unlikePost, showLikeList } from '../../actions/post';

class ViewerPageContainer extends Component {
  static propTyes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired
  };

  like = () => {
    const { dispatch } = this.props;
    const { postId } = this.props.params;
    const { userId, isAuthenticated } = this.props.user;
    if(isAuthenticated && userId) {
      dispatch(likePost(userId, postId));
    } else {
      this.gotoLoginPage();
    }
  }

  unlike = () => {
    const { dispatch } = this.props;
    const { postId } = this.props.params;
    const { userId, isAuthenticated } = this.props.user;
    if(isAuthenticated && userId) {
      dispatch(unlikePost(userId, postId));
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
    } else {
      this.gotoLoginPage();
    }
  }

  follow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props.user;
    dispatch(followUser(userId, followeeId));
  }

  unfollow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props.user;
    dispatch(unfollowUser(userId, followeeId));
  }

  gotoLoginPage() {
    browserHistory.push('/');
  }

  render() {
    const { post, user, like } = this.props;
    return (
      <Viewer
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
    like
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ViewerPageContainer, [ getPost ])
);
