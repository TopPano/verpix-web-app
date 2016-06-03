'use strict';

import React, { Component, PropTypes } from 'react';
import range from 'lodash/range';
import fill from 'lodash/fill';
import isFunction from 'lodash/fill';

if (process.env.BROWSER) {
  require('styles/LivePhoto.css');
}

export default class LivePhoto extends Component {
  constructor(props) {
    super(props);
    this.numPhotos = 0;
    this.photos = [];
  }

  componentDidMount() {
    if(process.env.BROWSER) {
      this.numPhotos = 200;
      this.photos = fill(Array(this.numPhotos), null);
      
      const midIndex = Math.round(this.numPhotos / 2);
      this.loadPhoto(midIndex, this.startAnimation.bind(this, midIndex));
      this.loadPhotos(0, midIndex);
      this.loadPhotos(midIndex + 1, this.numPhotos);
    }
  }

  loadPhotos(startIndex, endIndex) {
    range(startIndex, endIndex).forEach((index) => {
      this.loadPhoto(index);
    });
  }

  loadPhoto(index, callback) {
    let img = new Image();
    img.src = `https://dl.dropboxusercontent.com/u/89923172/live_photos/${index}.jpg`;
    img.onload = () => {
      this.photos[index] = img;
      if(callback && isFunction(callback)) {
        callback();
      }
    };
  }

  startAnimation(startIndex) {
    let index = startIndex;
    let direction = 'left';
    setInterval(() => {
      if(this.photos[index]) {
        this.renderPhoto(index);
        if(direction === 'left') {
          if(index === 0) {
            direction = 'right';
            index++;
          } else {
            index--;
          }
        } else {
          if(index === (this.numPhotos - 1)) {
            direction = 'left';
            index--;
          } else {
            index++;
          }
        }
      }
    }, 20);
  }

  renderPhoto(index) {
    const ctx = this.refs.container.getContext('2d');
    const img = this.photos[index];
    ctx.drawImage(img, 10, 10);
  }

  render() {
    return (
      <div className='live-photo-component'>
        <canvas id='container' ref='container' height={1000} width={1000} />
      </div>
    );
  }
}

LivePhoto.displayName = 'ViewLike';

LivePhoto.propTypes = {
};

LivePhoto.defaultProps = {
};

