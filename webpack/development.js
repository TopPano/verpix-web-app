'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: [
    'webpack-hot-middleware/client',
    './client'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        API_ROOT: JSON.stringify(process.env.API_ROOT),
        STATIC_URL: JSON.stringify(process.env.STATIC_URL)
      }
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new ExtractTextPlugin("app.css")
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader',
  include: [].concat(
    config.additionalPaths,
    [
      path.join(__dirname, '/../client'),
      path.join(__dirname, '/../shared')
    ]
  ),
  exclude: [
    /(\.spec\.js$)|(\.spec\.jsx$)/,
    path.join(__dirname, '/../shared/test-runner.js')
  ]

});

module.exports = config;
