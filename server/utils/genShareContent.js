import merge from 'lodash/merge';

import clientConfig from 'etc/client';

import SITE_CONTENT from 'content/site/en-us.json';
import VIEWER_CONTENT from 'content/viewer/en-us.json';
import { MEDIA_TYPE, ORIENTATION, SHARE_IMAGE_SIZE } from 'constants/common';
import { SITE_SHARE_IMAGE } from 'constants/site';

export default function renderSharePropsHtml(req, isViewerPage, post) {
  let content = {
    image: `${clientConfig.staticUrl}${SITE_SHARE_IMAGE}`,
    imageWidth: SHARE_IMAGE_SIZE.LANDSCAPE.WIDTH,
    imageHeight: SHARE_IMAGE_SIZE.LANDSCAPE.HEIGHT,
    title: SITE_CONTENT.SHARE.DEFAULT_CAPTION,
    description: SITE_CONTENT.SHARE.DEFAULT_DESCRIPTION,
    url: `${req.protocol}://${req.get('Host')}${req.url}`
  }

  if(isViewerPage) {
    const defaultViewerContent =
      post.mediaType === MEDIA_TYPE.LIVE_PHOTO ?
      VIEWER_CONTENT.SHARE.LIVE_PHOTO :
      VIEWER_CONTENT.SHARE.PANORAMA;
    const imageSize =
      post.mediaType === MEDIA_TYPE.LIVE_PHOTO && post.dimension.orientation === ORIENTATION.PORTRAIT ?
      SHARE_IMAGE_SIZE.PORTRAIT :
      SHARE_IMAGE_SIZE.LANDSCAPE;
    const newImage = post.thumbnail.srcUrl,
          newTitle = post.caption;
    content = merge({}, content, {
      image: newImage ? newImage : content.image,
      imageWidth: imageSize.WIDTH,
      imageHeight: imageSize.HEIGHT,
      title: newTitle ? newTitle : defaultViewerContent.DEFAULT_CAPTION,
      description: defaultViewerContent.DEFAULT_DESCRIPTION
    });
  }

  return content;
}
