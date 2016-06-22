import { isMobile } from 'lib/devices';

let events;
if(isMobile()) {
  events = {
    CLICK_START: 'touchstart',
    CLICK_MOVE: 'touchmove',
    CLICK_END: 'touchend',
    CLICK_CANCEL: 'touchcancel'
  }
} else {
  events = {
    CLICK_START: 'mousedown',
    CLICK_MOVE: 'mousemove',
    CLICK_END: 'mouseup',
    CLICK_CANCEL: 'mouseout'
  }
}

const EVENTS = events;
export default EVENTS
