'use strict';

import fill from 'lodash/fill';
import isFunction from 'lodash/isFunction';
import inRange from 'lodash/inRange';

import { DIRECTION, ORIENTATION } from 'constants/common';
import { STEP_DISTANCE } from 'constants/livePhoto';
import { isMobile } from 'lib/devices';
import { getPosition, getX, getY } from 'lib/events/click';
import EVENTS from 'constants/events';
import Promise from 'lib/utils/promise';

export default class LivePhotoPlayer {
  constructor(params) {
    // Read only member variables
    this.container = params.container;
    this.photosSrcUrl = params.photosSrcUrl;
    this.numPhotos = this.photosSrcUrl.length;
    this.direction = params.dimension.direction;
    this.orientation = params.dimension.orientation;

    // Writable member variables
    this.photos = fill(Array(this.numPhotos), null);
    this.curPhoto = Math.round(this.numPhotos / 2);
    this.lastPosition = null;
    
    // Transform container when orientation is portrait
    if(this.orientation === ORIENTATION.PORTRAIT) {
      const ctx = this.container.getContext('2d');
      ctx.rotate(90 * Math.PI / 180);
      ctx.translate(0, -this.container.width);
    }
  }

  start() {
    const startIndex = this.curPhoto;
    this.loadPhoto(startIndex, this.startAnimation.bind(this, startIndex));
    this.loadPhotos(startIndex - 1, -1, -5);
    this.loadPhotos(startIndex + 1, this.numPhotos, 5);
  }

  loadPhoto(index, callback) {
    let img = new Image();
    img.src = this.getPhotoSrc(index);
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

  getPhotoSrc(index) {
    return (
      inRange(index, this.numPhotos) ?
      this.photosSrcUrl[index].downloadUrl :
      ''
    );
  }

  startAnimation(startIndex) {
    this.renderPhoto(startIndex);
    this.container.addEventListener(EVENTS.CLICK_START, this.handleTransitionStart);
    this.container.addEventListener(EVENTS.CLICK_MOVE, this.handleTransitionMove);
  }

  renderPhoto(index) {
    const container = this.container;
    const ctx = container.getContext('2d');
    const img = this.photos[index];
    if(this.orientation === ORIENTATION.PORTRAIT) {
      ctx.drawImage(img, 0, 0, container.height, container.width);
    } else {
      ctx.drawImage(img, 0, 0, container.width, container.height);
    }
  }

  handleTransitionStart = (e) => {
    if(this.isLeftBtnPressed(e)) {
      this.lastPosition = getPosition(e);
    }
  }

  handleTransitionMove = (e) => {
    // Left button is clicked.
    if(this.isLeftBtnPressed(e)) {
      const lastPosition = this.lastPosition;
      const curX = getX(e), curY = getY(e);
      if(lastPosition) {
        const delta =
            this.direction === DIRECTION.HORIZONTAL ?
            curX - lastPosition.x :
            curY - lastPosition.y;
        let newCurPhoto = this.curPhoto + Math.round(delta / STEP_DISTANCE);

        if(delta < 0 && newCurPhoto < 0) {
          newCurPhoto = 0;
        } else if(delta > 0 && newCurPhoto >= this.numPhotos) {
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
    return (
      isMobile() ?
      true :
      (e.which && e.button === 0) || (e.button && e.button === 0)
    )
  }

  getSnapshot(width, height) {
    return new Promise((resolve, reject) => {
      if(inRange(this.curPhoto, this.numPhotos)) {
        resolve({
          imgUrl: this.getPhotoSrc(this.curPhoto),
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
