import fetch from 'isomorphic-fetch';
import trim from 'lodash/trim';

import externalApiConfig from 'etc/external-api';

const GRAPH_API_ROOT = 'https://graph.facebook.com';
const GOOGLE_API_ROOT = 'https://www.googleapis.com';
const DEFAULT_CAPTION = 'Verpix';

export function shareTwitter(link) {
  let position_left = screen.width / 2 - 400;
  var position_top = screen.height / 2 - 200;
  var spec ='height=400,width=800,top=' + position_top.toString() + ',left=' + position_left.toString();
  var url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(link);
  window.open(url, 'name', spec);
}

export function shareFacebook(accessToken, shareInfo, getSnapshot) {
  const snapshot = base64toBlob(getSnapshot(window.innerWidth, window.innerHeight));
  uploadPhoto(accessToken, snapshot).then((response) => {
    if(response.status >= 400) {
      // TODO: Error handling
      throw new Error('Bad response from server');
    }
    return response.json();
  }).then((data) => {
    // Get URL of the uploaded photo.
    const snapshotUrl = `${GRAPH_API_ROOT}/${data.id}/picture?access_token=${accessToken}`;

    shortenUrl(snapshotUrl).then((response) => {
      if(response.status >= 400) {
        // TODO: Error handling
        throw new Error('Bad response from server');
      }
      return response.json();
    }).then((data) => {
      // Shorten the URL.
      // We use the shorter URL because the original URL of uploaded snapshot (fb.cdn)
      // is not allowed in Facebook previewe image.
      const shortUrl = data.id;
      // Test whether caption is empty string (whitespaces) or not.
      const caption = trim(shareInfo.caption) ? trim(shareInfo.caption) : DEFAULT_CAPTION;
      // Post to Facebook.
      post(caption, shareInfo.link, shortUrl);
    });
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
  let config;

  data.append('access_token', accessToken);
  data.append('source', photo);
  data.append('privacy', JSON.stringify({ 'value': 'SELF' }));
  config = {
    method: 'POST',
    body: data
  }
  // Upload the photo to user's Facebook by using multipart/form-data post.
  return fetch(`${GRAPH_API_ROOT}/me/photos?access_token=${accessToken}`, config);
}

// Shorten URL by using Google URL Shortener.
function shortenUrl(longUrl) {
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      longUrl: longUrl
    })
  }
  return fetch(`${GOOGLE_API_ROOT}/urlshortener/v1/url?key=${externalApiConfig.google.shortUrlKey}`, config);
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
