'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadExploreRecent } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import Explorer from '../../components/Explorer.jsx';

class ExplorerPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    explorer: PropTypes.object.isRequired
  };

  hasMoreContent() {
    return this.props.explorer.recent.posts.hasNext;
  }

  loadMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.explorer.recent;
    dispatch(loadExploreRecent({
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    return (
      <Explorer explorer={this.props.explorer.recent}>
        {this.props.children}
      </Explorer>
    );
  }
}

function mapStateToProps(state) {
  const { explorer } = state;
  return {
    explorer
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(ExplorerPageContainer, [ loadExploreRecent ])
);
