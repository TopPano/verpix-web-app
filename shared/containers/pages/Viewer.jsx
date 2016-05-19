'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'

import Viewer from '../../components/Viewer';
import { followUser, unfollowUser } from '../../actions/user';
import { likePost, unlikePost } from '../../actions/post';
import { showLikeList } from '../../actions/post';

class ViewerPageContainer extends Component {
  static propTyes = {
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
    const { postId } = this.props.params;
    const { user, like} = this.props;
    const post = {
      postId,
      likes: {
        count: 0,
        isLiked: true
      }
    }
    return (
      <Viewer
        post={post}
        likelist={like}
        userId={user.userId}
        options={{}}
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
  const { user, like } = state;
  return {
    user,
    like
  }
}

export default connect(mapStateToProps)(ViewerPageContainer);
