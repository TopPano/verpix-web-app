/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import cookieParser from 'cookie-parser';
import qs from 'qs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';

import { fetchComponentsData } from './utils';

import routes from '../shared/routes';
import configureStore from '../shared/store/configureStore';

import serverConfig from '../etc/server-config.json';
import clientConfig from '../etc/client-config.json';

const app = new Express();

app.use('/static', Express.static('public/static'));
app.use(cookieParser());

// This is fired every time the server side receives a request
app.use((req, res) => {
  let initState = {};
  const accessToken = req.cookies.accessToken || null;
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
    const matchViewer = req.url.match(/(\/viewer\/@)+/);
    const isViewerPage = matchViewer && matchViewer.index === 0;

    // it's not allow to access pages other than Login and Viewer without authentication
    if (!isViewerPage && !req.url.match(/^\/$/ig)) {
      return res.redirect(302, '/');
    }
  }

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

        return renderHTML(html, initialState, clientConfig);
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

function renderHTML(html, initialState, config) {
  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Verpix</title>
      <link rel="shortcut icon" type="image/png" href="/static/images/favicon.png"/>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      <link rel="stylesheet" href="${config.staticUrl}/static/build/app.css">
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
    console.info(`==> 🌎  Listening on port ${serverConfig.port}. Open up http://localhost:${serverConfig.port}/ in your browser.`);
  }
});
