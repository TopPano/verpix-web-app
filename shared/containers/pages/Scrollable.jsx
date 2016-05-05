'use strict';

import React, { Component } from 'react';

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

  loadMoreContent() {
  }

  handleScroll = () => {
    // Determine: need to read more content or not.
    if(this.hasMoreContent()) {
      var offset = window.scrollY + window.innerHeight;
      var height = document.documentElement.offsetHeight;

      // Scroll to the bottom?
      if(offset === height) {
        this.loadMoreContent();
      }
    }
  }

  render() {
    return (
      <div />
    );
  }
}

