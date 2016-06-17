var merge = require('lodash/merge');

var customApiRoot = process.env.API_ROOT;
var config =
  (process.env.NODE_ENV === 'production') ?
  require('./client-config.prod.js') :
  require('./client-config.dev.js');

if(customApiRoot) {
  config = merge(config, {
    apiRoot: customApiRoot
  });
}

module.exports = config;
