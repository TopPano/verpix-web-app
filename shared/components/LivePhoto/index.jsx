'use strict';

import React, { Component } from 'react';

import LivePhotoPlayer from './LivePhotoPlayer';

if (process.env.BROWSER) {
  require('styles/LivePhoto.css');
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
        <canvas ref='container' width={144} height={256} />
      </div>
    );
  }
}

LivePhoto.displayName = 'ViewLike';

LivePhoto.propTypes = {
};

LivePhoto.defaultProps = {
};

