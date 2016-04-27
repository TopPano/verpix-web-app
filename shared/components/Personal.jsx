'use strict';

import React, { Component, PropTypes } from 'react';

import Summary from './Summary.jsx';
import Gallery from './Gallery.jsx';

import testdata from '../../test/data/testdata0.json';

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
          posts={ testdata.personal.posts }
          maxWidth={ testdata.personal.maxWidth }
          ratio={ testdata.personal.ratio }
        />
      </div>
    );
  }
}

Personal.displayName = 'Personal';
