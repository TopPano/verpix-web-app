import { isMobile } from 'lib/devices';

export function getPosition(e) {
  return {
    x: getX(e),
    y: getY(e)
  }
}

export function getX(e) {
  if(isMobile()) {
    return e.touches[0].pageX - e.target.getBoundingClientRect().left;
  } else {
    return e.offsetX;
  }
}

export function getY(e) {
  if(isMobile()) {
    return e.touches[0].pageY - e.target.getBoundingClientRect().top;
  } else {
    return e.offsetY;
  }
}

export default {
  getPosition,
  getX,
  getY
}
