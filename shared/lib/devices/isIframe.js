export default function isIframe() {
  if(process.env.BROWSER) {
    return window != window.top;
  } else {
    return false;
  }
}
