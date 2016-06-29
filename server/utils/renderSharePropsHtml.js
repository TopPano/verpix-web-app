import merge from 'lodash/merge';

import Promise from 'lib/utils/promise';
import externalApiConfig from 'etc/external-api';
import clientConfig from 'etc/client';
import api from 'lib/api';

export default function renderSharePropsHtml(req, isViewerPage) {
  const defaultContent = {
    image: `${clientConfig.staticUrl}/static/images/fb-share-default.jpg`,
    imageWidth: 600,
    imageHeight: 315,
    title: 'LOOK it\'s my awesome 360 photo!!',
    description: 'Register ＆ add your friends in Verpix to join more activities.',
    url: `${req.protocol}://${req.get('Host')}${req.url}`
  }

  let requestPostInfo;
  let shareProps = {
    // Open Graph tags
    'fb:app_id': `${externalApiConfig.facebook.id}`,
    'og:type': 'website',
    'og:site_name': 'Verpix',
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
      const newImage = response.result.thumbnail.srcUrl,
            newTitle = response.result.caption;
      const image = newImage ? newImage : defaultContent.image,
            title = newTitle ? newTitle : defaultContent.title;
      shareProps = merge({}, shareProps, {
        'og:image': image,
        'og:title': title
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
