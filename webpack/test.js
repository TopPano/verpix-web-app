'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('test'),
        API_ROOT: JSON.stringify(process.env.API_ROOT),
        STATIC_URL: JSON.stringify(process.env.STATIC_URL),
        GA_CODE: JSON.stringify(process.env.GA_CODE)
      }
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new ExtractTextPlugin("app.css")
  ],
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.preLoaders = [{
  test: /\.(js|jsx)$/,
  loader: 'isparta-instrumenter-loader',
  include: [
    path.join(__dirname, '/../shared')
  ],
  exclude: [
    /(\.spec\.js$)|(\.spec\.jsx$)/,
    path.join(__dirname, '/../shared/test-runner.js')
  ]
}];
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  include: [].concat(
    baseConfig.additionalPaths, [
      path.join(__dirname, '/../shared')
    ]
  )
});

module.exports = config;
