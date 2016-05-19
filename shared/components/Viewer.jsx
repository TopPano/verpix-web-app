'use strict';

import React, { Component, PropTypes } from 'react';
import { Base64 } from 'js-base64';
import queryString from 'query-string';

import { DEFAULT_VIEWER_OPTIONS } from '../lib/const';
import startViewer from '../lib/viewer.js';
import Sidebar from './Sidebar';

if (process.env.BROWSER) {
  require('styles/Viewer.css');
}

export default class Viewer extends Component {
  static propTyes = {
    postId: PropTypes.string.isRequired,
    options: PropTypes.object.isRequird
  }

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      const queryStr = Base64.decode(location.search.substr(1));
      const querys = queryString.parse(queryStr);
      const { options } = this.props;
      const params = {
        modelId: this.props.postId,
        cam: {
          lat: querys.lat ? querys.lat : (options.lat ? options.lat : DEFAULT_VIEWER_OPTIONS.LAT),
          lng: querys.lng ? querys.lng : (options.lng ? options.lng : DEFAULT_VIEWER_OPTIONS.LNG),
          fov: querys.fov ? querys.fov : (options.fov ? options.fov : DEFAULT_VIEWER_OPTIONS.FOV)
        },
        canvas: 'container'
      };
      startViewer(params);
    }
  }

  render() {
    return (
      <div className="viewer-component">
        <div id='container' />
        <Sidebar post={{}}/>
      </div>
    );
  }
}

Viewer.displayName = 'Viewer';
