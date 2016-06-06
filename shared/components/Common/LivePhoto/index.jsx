'use strict';

import React, { Component } from 'react';

import LivePhotoPlayer from './LivePhotoPlayer';

if (process.env.BROWSER) {
  require('./LivePhoto.css');
}

export default class LivePhoto extends Component {
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
      <div className='live-photo-component'>
        <canvas ref='container' width={288} height={512} />
      </div>
    );
  }
}

LivePhoto.displayName = 'LivePhoto';

LivePhoto.propTypes = {
};

LivePhoto.defaultProps = {
};

