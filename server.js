/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
});
