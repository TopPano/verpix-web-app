'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectDataFetchers } from '../../lib/utils';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import { listFollowers, listFollowing } from '../../actions/user';
import ScrollablePageContainer from './Scrollable';
import Personal from '../../components/Pages/Personal';

import { sendEvent } from '../../lib/utils/googleAnalytics';

class PersonalPageContainer extends ScrollablePageContainer {
  static propTyes = {
    person: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    children: PropTypes.object
  };

  hasMoreContent = () => {
    return this.props.person.posts.hasNext;
  }

  isFetchingContent() {
    return this.props.person.isFetching;
  }

  requestMoreContent() {
    const { dispatch } = this.props;
    const { id } = this.props.person;
    const { lastPostId } = this.props.person.posts;
    dispatch(loadUserPosts({
      userId: id,
      lastPostId
    }));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.id !== this.props.params.id) {
      // The id is changed, reload all state
      const { dispatch } = this.props;
      const { id } = nextProps.params;
      dispatch(loadUserSummary({id}));
      dispatch(loadUserPosts({userId: id}));
      dispatch(listFollowers({id}));
      dispatch(listFollowing({id}));
    }
  }

  followAndUpdate = (followeeId) => {
    this.follow(followeeId);
    this.updateFollowerList();
    sendEvent('personal page', 'follow');
  }

  unfollowAndUpdate = (followeeId) => {
    this.unfollow(followeeId);
    this.updateFollowerList();
    sendEvent('personal page', 'unfollow');
  }

  updateFollowerList = () => {
    setTimeout(() => {
      if(this.props.person.isFetching) {
        this.updateFollowerList();
      } else {
        const { dispatch } = this.props;
        const { id } = this.props.person;
        dispatch(loadUserSummary({id}));
        dispatch(listFollowing({id}));
      }
    });
  }

  render() {
    const { person, userId, like } = this.props;
    const isMyself = userId === person.id;
    return (
      <Personal
        person={person}
        userId={userId}
        like={like}
        followUser={isMyself ? this.followAndUpdate : this.follow}
        unfollowUser={isMyself ? this.unfollowAndUpdate : this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
        loadMorePosts={this.loadMoreContent}
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
