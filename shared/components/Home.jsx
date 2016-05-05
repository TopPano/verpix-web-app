'use strict';

import React, { Component } from 'react';

import NavBar from './NavBar.jsx';
import NewsFeedPageContainer from '../containers/pages/NewsFeed.jsx'
import ExplorerPageContainer from '../containers/pages/Explorer.jsx';

if (process.env.BROWSER) {
  require('styles/Home.css');
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 0
    };
  }

  selectPage = (page) => {
    this.setState({
      selectedPage: page
    });
  }

  render() {
    let pages = [
      <NewsFeedPageContainer />,
      <ExplorerPageContainer />
    ];

    return (
      <div className="home-component">
        <NavBar
          texts={['Following', 'Recent']}
          initialSelectedItem={0}
          clickCallback={this.selectPage}
        />
        {pages[this.state.selectedPage]}
      </div>
    );
  }
}

Home.displayName = 'Home';
