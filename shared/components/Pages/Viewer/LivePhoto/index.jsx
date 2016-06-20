'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import LivePhotoPlayer from './LivePhotoPlayer';
import { ORIENTATION } from 'constants/common';

if (process.env.BROWSER) {
  require('./LivePhoto.css');
}

const propTypes = {
  post: PropTypes.object.isRequired
};

const defaultProps = {
};

class LivePhoto extends Component {
  constructor(props) {
    super(props);
    this.player = null;
  }

  getSnapshot() {
    if(this.player) {
      return this.player.getSnapshot(480, 640);
    }
    return null;
  }

  getCurrentUrl() {
    if(this.player) {
      return this.player.getCurrentUrl();
    }
    return '';
  }

  componentDidMount() {
    if(process.env.BROWSER) {
      const { post } = this.props;
      this.player = new LivePhotoPlayer({
        container: this.refs.container,
        photosSrcUrl: post.media.srcHighImages,
        dimension: post.dimension
      });
      this.player.start();
    }
  }

  render() {
    const isPortrait = this.props.post.dimension.orientation == ORIENTATION.PORTRAIT;
    const livePhotoClass = classNames({
      'live-photo-component': true,
      'orientation-portrait': isPortrait
    });
    const livePhotoContainerClass = classNames({
      'live-photo-container': true,
      'orientation-portrait': isPortrait
    });
    // TODO: Set canvas width and height automatically
    const width = isPortrait ? 480 : 640;
    const height = isPortrait ? 640 : 480;

    return (
      <div className={livePhotoClass}>
        <canvas ref="container" className={livePhotoContainerClass} width={width} height={height} />
      </div>
    );
  }
}

LivePhoto.propTypes = propTypes;
LivePhoto.defaultProps = defaultProps;

export default LivePhoto;
