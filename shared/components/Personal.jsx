'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary.jsx';
import Gallery from './Gallery.jsx';

if (process.env.BROWSER) {
  require('styles/personal/Personal.css');
}

export default class Personal extends Component {
  static propTyes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;

    return (
      <div className="personal-component">
        <Summary user={user} />
        <Gallery
          posts={ user.posts }
          maxWidth={ 500 }
          ratio={ 2 }
        />
      </div>
    );
  }
}

Personal.displayName = 'Personal';
