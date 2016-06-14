'use strict';

import fill from 'lodash/fill';
import isFunction from 'lodash/isFunction';
import inRange from 'lodash/inRange';

export default class LivePhotoPlayer {
  constructor(params) {
    // Read only member variables
    this.container = params.container;
    this.srcRoot = params.srcRoot;
    this.numPhotos = params.numPhotos;

    // Writable member variables
    this.photos = fill(Array(this.numPhotos), null);
    this.curPhoto = Math.round(this.numPhotos / 2);
    this.lastPosition = {};
  }

  start() {
    const startIndex = this.curPhoto;
    this.loadPhoto(startIndex, this.startAnimation.bind(this, startIndex));
    this.loadPhotos(startIndex - 1, -1, -5);
    this.loadPhotos(startIndex + 1, this.numPhotos, 5);
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
    this.renderPhoto(startIndex);
    this.container.addEventListener('mousedown', this.handleTransitionStart);
    this.container.addEventListener('mousemove', this.handleTransitionMove);
  }

  renderPhoto(index) {
    const ctx = this.container.getContext('2d');
    const img = this.photos[index];
    ctx.drawImage(img, 0, 0, this.container.width, this.container.height);
  }

  handleTransitionStart = (e) => {
    if(this.isLeftBtnPressed(e)) {
      this.lastPosition = { x: e.clientX, y: e.clientY };
    }
  }

  handleTransitionMove = (e) => {
    // Left button is clicked.
    if(this.isLeftBtnPressed(e)) {
      const lastX = this.lastPosition.x;
      const curX = e.clientX, curY = e.clientY;
      if(lastX) {
        const deltaX = curX - lastX;
        let newCurPhoto = this.curPhoto + deltaX;

        if(deltaX < 0 && newCurPhoto < 0) {
          newCurPhoto = 0;
        } else if(deltaX > 0 && newCurPhoto >= this.numPhotos) {
          newCurPhoto = this.numPhotos - 1;
        }
        if(this.photos[newCurPhoto]) {
          this.curPhoto = newCurPhoto;
          this.renderPhoto(newCurPhoto);
        }
      }
      this.lastPosition = { x: curX, y: curY };
    }
  }

  isLeftBtnPressed(e) {
    return (e.which && e.button === 0) || (e.button && e.button === 0);
  }

  getSnapshot(width, height) {
    return new Promise((resolve, reject) => {
      if(inRange(this.curPhoto, this.numPhotos)) {
        resolve({
          imgUrl: `${this.srcRoot}/${this.curPhoto}.jpg`,
          width,
          height
        });
      } else {
        reject();
      }
    });
  }

  getCurrentUrl() {
    return window.location.href.split('?')[0];
  }
}
