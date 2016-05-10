'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import { followUser, unfollowUser } from '../../actions/user';
import { listFollowers, listFollowing } from '../../actions/user';
import { likePost, unlikePost } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import Personal from '../../components/Personal.jsx';

class PersonalPageContainer extends ScrollablePageContainer {
  static propTyes = {
    person: PropTypes.object.isRequired,
    children: PropTypes.object
  };

  hasMoreContent() {
    return this.props.person.posts.hasNext;
  }

  loadMoreContent() {
    const { dispatch } = this.props;
    const { id } = this.props.person;
    const { lastPostId } = this.props.person.posts;
    dispatch(loadUserPosts({
      userId: id,
      lastPostId
    }));
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

  render() {
    const { person, userId } = this.props;
    return (
      <Personal
        person={person}
        userId={userId}
        followUser={this.follow}
        unfollowUser={this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
      >
        {this.props.children}
      </Personal>
    );
  }
}

function mapStateToProps(state) {
  const { person } = state;
  const { userId } = state.user;
  return {
    person,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(PersonalPageContainer, [ loadUserSummary, loadUserPosts, listFollowers, listFollowing ])
);
