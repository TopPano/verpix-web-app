import MobileDetect from 'mobile-detect';

export function isMobile() {
  if (process.env.BROWSER) {
    return new MobileDetect(window.navigator.userAgent).mobile() ? true :false;
  } else {
    return false;
  }
}
