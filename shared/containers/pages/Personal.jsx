'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import { listFollowers, listFollowing } from '../../actions/user';
import ScrollablePageContainer from './Scrollable.jsx';
import Personal from '../../components/Personal.jsx';

class PersonalPageContainer extends ScrollablePageContainer {
  static propTyes = {
    person: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
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

  render() {
    const { person, userId, like } = this.props;
    return (
      <Personal
        person={person}
        userId={userId}
        like={like}
        followUser={this.follow}
        unfollowUser={this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
      >
        {this.props.children}
      </Personal>
    );
  }
}

function mapStateToProps(state) {
  const { person, like } = state;
  const { userId } = state.user;
  return {
    person,
    like,
    userId
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(PersonalPageContainer, [ loadUserSummary, loadUserPosts, listFollowers, listFollowing ])
);
