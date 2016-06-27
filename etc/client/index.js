'use strict';

var merge = require('lodash/merge');

var config =
  (process.env.NODE_ENV === 'production') ?
  require('./production.js') :
  require('./development.js');

module.exports = merge({}, config, {
  apiRoot: process.env.API_ROOT,
  staticUrl: process.env.STATIC_URL
});
