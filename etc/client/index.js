'use strict';

var merge = require('lodash/merge');

var base = require('./base');
var config =
  (process.env.NODE_ENV === 'production') ?
  require('./production.js') :
  require('./development.js');

module.exports = merge({}, base, config, {
  apiRoot: process.env.API_ROOT,
  staticUrl: process.env.STATIC_URL,
  gaTrackingCode: process.env.GA_CODE
});
