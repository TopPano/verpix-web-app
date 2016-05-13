'use strict';

import React, { Component, PropTypes } from 'react';

import { VIEWER_URL } from '../lib/const';

if (process.env.BROWSER) {
  require('styles/Viewer.css');
}

export default class Viewer extends Component {
  static propTyes = {
    postId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { postId } = this.props;
    const url = VIEWER_URL + '?post=' + postId;
    return (
      <div className="viewer-component">
        <iframe
          src={url}
          width='100%'
          height='100%'
          style={{border: 'none'}}
          webkitAllowFullScreen
          mozAllowFullScreen
          allowFullScreen
        >
        </iframe>
      </div>
    );
  }
}

Viewer.displayName = 'Viewer';
