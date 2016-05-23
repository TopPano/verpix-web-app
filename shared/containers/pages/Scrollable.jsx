'use strict';

import React, { Component } from 'react';

import { followUser, unfollowUser } from '../../actions/user';
import { likePost, unlikePost } from '../../actions/post';
import { showLikeList } from '../../actions/post';

const REMAINED_SCROLL_OFFSET = 100;

export default class ScrollablePageContainer extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  hasMoreContent() {
    return true;
  }

  isFetchingContent() {
    return true;
  }

  requestMoreContent() {
  }

  loadMoreContent = () => {
    if(this.hasMoreContent() && !this.isFetchingContent()) {
      this.requestMoreContent();
    }
  }

  handleScroll = () => {
    // Determine: need to read more content or not.
    if(this.hasMoreContent() && !this.isFetchingContent()) {
      var offset = window.scrollY + window.innerHeight;
      var height = document.documentElement.offsetHeight - REMAINED_SCROLL_OFFSET;

      // Scroll to the bottom?
      if(offset >= height) {
        this.requestMoreContent();
      }
    }
  }

  follow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props;
    dispatch(followUser(userId, followeeId));
  }

  unfollow = (followeeId) => {
    const { dispatch } = this.props;
    const { userId } = this.props;
    dispatch(unfollowUser(userId, followeeId));
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

  getLikelist = (postId) => {
    const { dispatch } = this.props;
    dispatch(showLikeList(postId));
  }

  render() {
    return (
      <div />
    );
  }
}

