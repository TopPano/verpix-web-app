'use strict';

import fill from 'lodash/fill';
import isFunction from 'lodash/fill';

export default class LivePhotoPlayer {
  constructor(params) {
    this.container = params.container;
    this.srcRoot = params.srcRoot;
    this.numPhotos = params.numPhotos;
    this.photos = fill(Array(this.numPhotos), null);
  }

  start() {
    const midIndex = Math.round(this.numPhotos / 2);
    this.loadPhoto(midIndex, this.startAnimation.bind(this, midIndex));
    this.loadPhotos(midIndex - 1, -1, -5);
    this.loadPhotos(midIndex + 1, this.numPhotos, 5);
  }

  loadPhoto(index, callback) {
    let img = new Image();
    img.src = `${this.srcRoot}/${index}.jpg`;
    img.onload = () => {
      this.photos[index] = img;
      if(callback && isFunction(callback)) {
        callback();
      }
    };
  }

  loadPhotos(start, end, step) {
    if(step > 0 && start < end) {
      let curIndex = start;
      for(;(curIndex < start + step) && (curIndex < end);curIndex++) {
        const callback = () => {
          if(curIndex < end) {
            this.loadPhoto(curIndex, callback);
          }
          curIndex++;
        }
        this.loadPhoto(curIndex, callback);
      }
    } else if(step < 0 && start > end) {
      let curIndex = start;
      for(;(curIndex > start + step) && (curIndex > end);curIndex--) {
        const callback = () => {
          if(curIndex > end) {
            this.loadPhoto(curIndex, callback);
          }
          curIndex--;
        }
        this.loadPhoto(curIndex, callback);
      }
    }
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
    const ctx = this.container.getContext('2d');
    const img = this.photos[index];
    ctx.drawImage(img, 0, 0, this.container.width, this.container.height);
  }
}
