'use strict';

var merge = require('lodash/merge');

var base = require('./base');
var config =
  (process.env.NODE_ENV === 'production') ?
    require('./production.js') :
    require('./development.js');

module.exports = merge({}, base, config, {
  google: {
    gaTrackingCode: process.env.GA_CODE
  }
});
