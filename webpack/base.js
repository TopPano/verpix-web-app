'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../public/static/build'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath
  },
  postcss: (webpack) => {
    return [
      require('postcss-import')({
        addDependencyTo: webpack,
        path: [
          path.resolve(__dirname + "/../shared/components/Common/Styles")
        ]
      }),
      require('postcss-cssnext')(),
      require('precss')()
    ];
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname),
    alias: {
      actions: 'shared/actions/',
      components: 'shared/components/',
      config: 'shared/config/',
      containers: 'shared/containers/',
      etc: 'etc',
      lib: 'shared/lib',
      reducers: 'shared/reducers',
      shared: 'shared',
      store: 'shared/store'
    }
  },
  module: {}
};
