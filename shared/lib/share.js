import $ from 'jquery';
import trim from 'lodash/trim';
import { getSnapshot } from './viewer.js';

const GOOGLE_SHORT_URL_KEY = 'AIzaSyDMWU0bIoW4FS1OvfCT_X8OCBfe6CLOsCw';
const DEFAULT_CAPTION = 'Verpix';

export function shareTwitter(link) {
  let position_left = screen.width / 2 - 400;
  var position_top = screen.height / 2 - 200;
  var spec ='height=400,width=800,top=' + position_top.toString() + ',left=' + position_left.toString();
  var url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(link);
  window.open(url, 'name', spec);
}

export function shareFacebook(accessToken, shareInfo) {
  const snapshot = base64toBlob(getSnapshot($(window).width(), $(window).height()));
  uploadPhoto(accessToken, snapshot).done((response) => {
    // Get URL of the uploaded photo.
    const snapshotUrl = 'https://graph.facebook.com/' + response.id + '/picture?access_token=' + accessToken;

    shortenUrl(snapshotUrl).done((response) => {
      // Shorten the URL.
      // We use the shorter URL because the original URL of uploaded snapshot (fb.cdn)
      // is not allowed in Facebook previewe image.
      const shortUrl = response.id;
      // Test whether caption is empty string (whitespaces) or not.
      const caption = trim(shareInfo.caption) ? trim(shareInfo.caption) : DEFAULT_CAPTION;
      // Post to Facebook.
      post(caption, shareInfo.link, shortUrl);
    }).fail(() => {
      // TODO: Error handling.
    });
  }).fail(() => {
    // TODO: Error handling.
  });
}

function base64toBlob(dataUrl) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if(dataUrl.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataUrl.split(',')[1]);
  } else {
    byteString = unescape(dataUrl.split(',')[1]);
  }

  // separate out the mime component
  let mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

// Upload an image to Facebook by using Graph API.
function uploadPhoto(accessToken, photo) {
  let data = new FormData();

  data.append('access_token', accessToken);
  data.append('source', photo);
  data.append('privacy', JSON.stringify({ 'value': 'SELF' }));
  // Upload the photo to user's Facebook by using multipart/form-data post.
  return $.ajax({
    url: 'https://graph.facebook.com/me/photos?access_token=' + accessToken,
    type: 'POST',
    contentType: false,
    processData: false,
    data: data
  });
}

// Shorten URL by using Google URL Shortener.
function shortenUrl(longUrl) {
  return $.ajax({
    url : 'https://www.googleapis.com/urlshortener/v1/url?key=' + GOOGLE_SHORT_URL_KEY,
    type: 'POST',
    data: JSON.stringify({
      longUrl: longUrl
    }),
    contentType: 'application/json'
  });
}

// Post to Facebook by using Dialog API.
function post(title, linkUrl, imgUrl) {
  if(window.FB) {
    window.FB.ui({
      method: 'share',
      display: 'iframe',
      mobile_iframe: true,
      href: linkUrl,
      title: title,
      picture: imgUrl
    }, () => {
      // TODO: Show success message after posting.
    });
  }
}
