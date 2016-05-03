'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';
import LoginPageContainer from './Login.jsx';
import NewsFeedPageContainer from './NewsFeed.jsx'

class HomePageContainer extends Component {
  static propTyes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  render() {
    const { isAuthenticated, username } = this.props.user;
    return (
      <div>
        {isAuthenticated &&
          <NewsFeedPageContainer>
            {this.props.children}
          </NewsFeedPageContainer>
        }
        {!isAuthenticated &&
          <LoginPageContainer />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps)(HomePageContainer);
