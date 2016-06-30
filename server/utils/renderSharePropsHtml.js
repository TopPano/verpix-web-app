import merge from 'lodash/merge';

import Promise from 'lib/utils/promise';
import externalApiConfig from 'etc/external-api';
import clientConfig from 'etc/client';
import api from 'lib/api';

import SITE_CONTENT from 'content/site/en-us.json';
import VIEWER_CONTENT from 'content/viewer/en-us.json';
import { MEDIA_TYPE, ORIENTATION, SHARE_IMAGE_SIZE } from 'constants/common';
import { SITE_SHARE_IMAGE } from 'constants/site';

export default function renderSharePropsHtml(req, isViewerPage) {
  const defaultContent = {
    image: `${clientConfig.staticUrl}${SITE_SHARE_IMAGE}`,
    imageWidth: SHARE_IMAGE_SIZE.LANDSCAPE.WIDTH,
    imageHeight: SHARE_IMAGE_SIZE.LANDSCAPE.HEIGHT,
    title: SITE_CONTENT.SHARE.DEFAULT_CAPTION,
    description: SITE_CONTENT.SHARE.DEFAULT_DESCRIPTION,
    url: `${req.protocol}://${req.get('Host')}${req.url}`
  }

  let requestPostInfo;
  let shareProps = {
    // Open Graph tags
    'fb:app_id': `${externalApiConfig.facebook.id}`,
    'og:type': 'website',
    'og:site_name': SITE_CONTENT.SITE_NAME,
    'og:image': defaultContent.image,
    'og:image:width': defaultContent.imageWidth,
    'og:image:height': defaultContent.imageHeight,
    'og:title': defaultContent.title,
    'og:description': defaultContent.description,
    'og:url': defaultContent.url
  }

  if(isViewerPage) {
    const postId = getViewerPostId(req.url);
    requestPostInfo = api.posts.getPost(postId).then((response) => {
      const defaultViewerContent =
        response.result.mediaType === MEDIA_TYPE.LIVE_PHOTO ?
        VIEWER_CONTENT.SHARE.LIVE_PHOTO :
        VIEWER_CONTENT.SHARE.PANORAMA;
      const imageSize =
        response.result.mediaType === MEDIA_TYPE.LIVE_PHOTO && response.result.dimension.orientation === ORIENTATION.PORTRAIT ?
        SHARE_IMAGE_SIZE.PORTRAIT :
        SHARE_IMAGE_SIZE.LANDSCAPE;
      const newImage = response.result.thumbnail.srcUrl,
            newTitle = response.result.caption;
      const image = newImage ? newImage : defaultContent.image,
            imageWidth = imageSize.WIDTH,
            imageHeight = imageSize.HEIGHT,
            title = newTitle ? newTitle : defaultViewerContent.DEFAULT_CAPTION,
            description = defaultViewerContent.DEFAULT_DESCRIPTION;
      shareProps = merge({}, shareProps, {
        'og:image': image,
        'og:image:width': imageWidth,
        'og:image:height': imageHeight,
        'og:title': title,
        'og:description': description
      });

      return renderPropsHtml(shareProps);
    }).catch((error) => {
      console.log(error);
    });
  } else {
    requestPostInfo = Promise.resolve(renderPropsHtml(shareProps));
  }

  return requestPostInfo;
}

function getViewerPostId(url) {
  const startIndex = url.indexOf('@') + 1;
  const endIndex = url.indexOf('?');

  return (endIndex === -1) ? url.slice(startIndex) : url.slice(startIndex, endIndex);
}

function renderPropsHtml(shareProps) {
  let propsHtml = '';

  for(const propName in shareProps) {
    propsHtml += renderPropHtml(propName, shareProps[propName]);
  }

  return propsHtml;
}

function renderPropHtml(propName, content) {
  return `
    <meta property="${propName}" content="${content}">
  `;
}
