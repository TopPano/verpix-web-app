'use strict';

import React, { Component } from 'react';

if (process.env.BROWSER) {
  require('./PhotoUploader.css');
}

export default class PhotoUploader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <img className='photo-uploader-component'
        src='/static/images/personal/personal-profile-upload.png'
        alt='upload'
      />
    );
  }
}

PhotoUploader.displayName = 'PhotoUploader';

PhotoUploader.propTypes = {
};
PhotoUploader.defaultProps = {
};

