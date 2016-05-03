'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';

class NewsFeedPageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  render() {
    const { posts } = this.props.newsFeed;
    return (
      <div>
        <h1> This is Home Page </h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { newsFeed } = state;
  return {
    newsFeed
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(NewsFeedPageContainer, [ loadNewsFeed ])
);
