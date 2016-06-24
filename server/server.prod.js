/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import cookieParser from 'cookie-parser';
import qs from 'qs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import merge from 'lodash/merge';

import { fetchComponentsData, getViewerPostId } from './utils';

import api from 'lib/api';
import routes from 'shared/routes';
import configureStore from 'store/configureStore';

import serverConfig from 'etc/server';
import clientConfig from 'etc/client';
import externalApiConfig from 'etc/external-api';

const app = new Express();

app.use('/static', Express.static('public/static'));
app.use(cookieParser());

// This is fired every time the server side receives a request
app.use((req, res) => {
  let initState = {};
  const accessToken = req.cookies.accessToken || null;
  const matchViewer = req.url.match(/(\/viewer\/@)+/);
  const isViewerPage = matchViewer && matchViewer.index === 0;
  const isFAQPage = (req.url === '/faq');

  if (accessToken) {
    // restore the client state
    initState.user = {
      isFetching: false,
      isAuthenticated: true,
      userId: req.cookies.userId,
      username: req.cookies.username,
      profilePhotoUrl: req.cookies.profilePhotoUrl,
      email: req.cookies.email,
      created: req.cookies.created
    };
  } else {
    // it's not allow to access pages other than Login and Viewer without authentication
    if (!isViewerPage && !isFAQPage && !req.url.match(/^\/$/ig)) {
      return res.redirect(302, '/');
    }
  }

  let ogProps = {};
  let requestPostInfo;

  ogProps = {
    appId: `${externalApiConfig.facebook.id}`,
    type: 'website',
    siteName: 'Verpix',
    image: `${clientConfig.staticUrl}/static/images/fb-share-default.jpg`,
    imgWidth: 600,
    imgHeight: 315,
    title: 'LOOK it\'s my awesome 360 photo!!',
    description: 'Register ＆ add your friends in Verpix to join more activities.',
    url: `${req.protocol}://${req.get('Host')}${req.url}`
  }
  if(isViewerPage) {
    const postId = getViewerPostId(req.url);
    requestPostInfo = api.posts.getPost(postId).then((response) => {
      const newImage = response.result.thumbnail.srcUrl,
            newTitle = response.result.caption;
      ogProps = merge({}, ogProps, {
        image: newImage ? newImage : ogProps.image,
        title: newTitle ? newTitle : ogProps.title
      });
    }).catch((error) => {
      console.log(error);
    });
  } else {
    requestPostInfo = Promise.resolve();
  }

  requestPostInfo.then(() => {
    const store = configureStore(initState);

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.send(500, error.message);
      } else if (!renderProps) {
        res.send(404, 'Not found')
      } else {
        fetchComponentsData(
          store.dispatch,
          renderProps.components,
          renderProps.params,
          renderProps.location.query,
          accessToken
        )
        .then(() => {
          const html = renderToString(
            <Provider store={store}>
              <div>
                <RouterContext {...renderProps} />
              </div>
            </Provider>
          );

          // Grab the inital state from the store
          const initialState = store.getState();

          return renderHTML(html, initialState, clientConfig, ogProps);
        })
        .then(html => {
          // Send the rendered page back to the client
          res.end(html);
        })
        .catch(err => {
          console.log(err.stack);
          res.end(err.message);
        });
      }
    });
  });
});

function renderHTML(html, initialState, config, ogProps) {
  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta property="fb:app_id" content="${ogProps.appId}">
      <meta property="og:site_name" content="${ogProps.siteName}">
      <meta property="og:image" content="${ogProps.image}">
      <meta property="og:image:width" content="${ogProps.imgWidth}">
      <meta property="og:image:height" content="${ogProps.imgHeight}">
      <meta property="og:title" content="${ogProps.title}">
      <meta property="og:description" content="${ogProps.description}">
      <meta property="og:url" content="${ogProps.url}">
      <title>Verpix</title>
      <link rel="shortcut icon" type="image/png" href="/static/images/favicon.png">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      <link rel="stylesheet" href="${config.staticUrl}/static/build/app.css">
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      </script>
    </head>
    <body>
      <div id="app">${html}</div>

      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
      <script type="text/javascript" src="${config.staticUrl}/static/build/vendor.bundle.js"></script>
      <script type="text/javascript" src="${config.staticUrl}/static/build/app.js"></script>
    </body>
    </html>
  `;
}

app.listen(serverConfig.port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Listening on port ${serverConfig.port}.`);
  }
});
