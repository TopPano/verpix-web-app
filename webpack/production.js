'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: {
    app: path.join(__dirname, '../client'),
    vendor: [ 'react', 'react-dom', 'three' ]
  },
  cache: false,
  debug: false,
  devtool: null,
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js"
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production'),
        API_ROOT: JSON.stringify(process.env.API_ROOT)
      }
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      output: { comments: false }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("app.css")
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
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
