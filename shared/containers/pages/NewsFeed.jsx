'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import NewsFeed from '../../components/NewsFeed.jsx';
import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';

class NewsFeedPageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    newsFeed: PropTypes.object.isRequired
  };

  render() {
    return (
      <NewsFeed newsFeed={this.props.newsFeed}>
        {this.props.children}
      </NewsFeed>
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
