'use strict';

import React, { Component, PropTypes } from 'react';
import startViewer from '../lib/viewer.js';

if (process.env.BROWSER) {
  require('styles/Viewer.css');
}

export default class Viewer extends Component {
  static propTyes = {
    postId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      let params = {
        modelId: this.props.postId,
        center: {
          lat: 0,
          lng: 30
        },
        zoom: 70,
        canvas: 'container'
      };
      startViewer(params);
    }
  }

  render() {
    return (
      <div className="viewer-component">
        <div id='container' />
      </div>
    );
  }
}

Viewer.displayName = 'Viewer';
