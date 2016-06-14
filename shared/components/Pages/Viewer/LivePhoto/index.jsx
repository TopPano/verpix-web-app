'use strict';

import React, { Component } from 'react';

import LivePhotoPlayer from './LivePhotoPlayer';

if (process.env.BROWSER) {
  require('./LivePhoto.css');
}

const propTypes = {
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
      this.player = new LivePhotoPlayer({
        container: this.refs.container,
        srcRoot: 'https://dl.dropboxusercontent.com/u/89923172/live_photos',
        numPhotos: 200
      });
      this.player.start();
    }
  }

  render() {
    return (
      <div className='live-photo-component live-photo-portrait'>
        <canvas ref='container' className='live-photo-container' />
      </div>
    );
  }
}

LivePhoto.propTypes = propTypes;
LivePhoto.defaultProps = defaultProps;

export default LivePhoto;
