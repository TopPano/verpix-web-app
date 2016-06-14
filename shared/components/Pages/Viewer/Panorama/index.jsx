'use strict';

import React, { Component, PropTypes } from 'react';
import { Base64 } from 'js-base64';
import queryString from 'query-string';
import urlencode from 'urlencode';

import { DEFAULT_PANOROMA_OPTIONS } from 'constants/panorama';
import { startViewer, stopViewer } from './PanoramaPlayer';
import { getSnapshot, getCurrentUrl } from './PanoramaPlayer';

if(process.env.BROWSER) {
  require('./Panorama.css');
}

const propTypes = {
  post: PropTypes.object.isRequired,
  likelist: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
}

const defaultProps = {
}

class Panorama extends Component {
  constructor(props) {
    super(props);
  }

  getSnapshot(accessToken) {
    return getSnapshot(window.innerWidth, window.innerHeight, accessToken);
  }

  getCurrentUrl() {
    return getCurrentUrl();
  }

  componentDidMount() {
    if(process.env.BROWSER) {
      const { post } = this.props;
      const search = location.search.substr(1);
      const queryStr = Base64.decode(urlencode.decode(search.substr(0, search.indexOf('&')), 'gbk'));
      const querys = queryString.parse(queryStr);
      const params = {
        imgs: post.media.srcTiledImages,
        cam: {
          lat: querys.lat ? querys.lat : (post.dimension.lat ? post.dimension.lat : DEFAULT_PANOROMA_OPTIONS.LAT),
          lng: querys.lng ? querys.lng : (post.dimension.lng ? post.dimension.lng : DEFAULT_PANOROMA_OPTIONS.LNG),
          fov: querys.fov ? querys.fov : (post.dimension.fov ? post.dimension.fov : DEFAULT_PANOROMA_OPTIONS.FOV)
        },
        canvas: 'container'
      };
      startViewer(params);
    }
  }

  componentWillUnmount() {
    if(process.env.BROWSER) {
      stopViewer();
    }
  }

  render() {
    return (
      <div
        id="container"
        className="panorama-component"
      />
    );
  }
}

Panorama.propTypes = propTypes;
Panorama.defaultProps = defaultProps;

export default Panorama;
