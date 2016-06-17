var merge = require('lodash/merge');

var customConfig = process.env.CLIENT_CONFIG;
var config =
  (process.env.NODE_ENV === 'production') ?
  require('./client-config.prod.js') :
  require('./client-config.dev.js');

module.exports = merge(config, {
  apiRoot: process.env.API_ROOT,
  staticUrl: process.env.STATIC_URL
});
