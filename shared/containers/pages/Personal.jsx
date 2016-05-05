'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
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
    const { params, dispatch } = this.props;
    const { posts } = this.props.person;
    dispatch(loadUserPosts({
      userId: params.id,
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    return (
      <Personal person={this.props.person}>
        {this.props.children}
      </Personal>
    );
  }
}

function mapStateToProps(state) {
  const { person } = state;
  return {
    person
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(PersonalPageContainer, [ loadUserSummary, loadUserPosts ])
);
