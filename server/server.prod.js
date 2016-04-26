/* eslint no-console:0 */

import path from 'path';
import Express from 'express';
import qs from 'qs';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';

import { fetchComponentsData } from './utils';

import routes from '../shared/routes';
import configureStore from '../shared/store/configureStore';

import clientConfig from '../etc/client-config.json';

const app = new Express();

app.use('/static', Express.static('public/static'));

// Use this middleware to set up hot module reloading via webpack
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender(req, res) {

  const store = configureStore({
    user: {
      sid: '86c80bf0-e079-11e5-9c0e-e744d7fead4a',
      accessToken: 'ievIDwaKhcLMDAmvyq0JHNabMQMHigyZvUf8acrMavVvzR0CUy9k8eC0I5c21qOw'
    }
  })

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.send(500, error.message);
    } else if (!renderProps) {
      res.send(404, 'Not found')
    } else {
      console.log('renderProps: '+JSON.stringify(renderProps));
      fetchComponentsData(
        store.dispatch,
        renderProps.components,
        renderProps.params,
        renderProps.location.query
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
}

function renderHTML(html, initialState, config) {
  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" conten"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Verpix</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      <link rel="stylesheet" href="${config.staticUrl}/static/build/app.css">
    </head>
    <body>
      <div id="app">${html}</div>

      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
      <script type="text/javascript" src="${config.staticUrl}/static/build/app.js"></script>
    </body>
    </html>
  `;
}

app.listen(config.port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${config.port}. Open up http://localhost:${config.port}/ in your browser.`);
  }
});
