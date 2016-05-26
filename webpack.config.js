'use strict';

const path = require('path');

// List of allowed environments
const allowedEnvs = ['development', 'production', 'test'];

// Select environment
var env = process.env.NODE_ENV;

// Get available configurations
const configs = {
  base: require(path.join(__dirname, 'webpack/base')),
  development: require(path.join(__dirname, 'webpack/development')),
  production: require(path.join(__dirname, 'webpack/production')),
  test: require(path.join(__dirname, 'webpack/test'))
};

/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(wantedEnv) {
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
  let validEnv = isValid ? wantedEnv : 'development';
  process.env.REACT_WEBPACK_ENV = validEnv;
  return configs[validEnv];
}

module.exports = buildConfig(env);
