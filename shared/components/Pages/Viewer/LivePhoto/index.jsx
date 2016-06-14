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
  }

  componentDidMount() {
    if(process.env.BROWSER) {
      new LivePhotoPlayer({
        container: this.refs.container,
        srcRoot: 'https://dl.dropboxusercontent.com/u/89923172/live_photos',
        numPhotos: 200
      }).start();
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
