'use strict';

const path = require('path');

// List of allowed environments
const allowedEnvs = ['dev', 'prod', 'test'];

// Select environment
var env = process.env.NODE_ENV;

// Get available configurations
const configs = {
  base: require(path.join(__dirname, 'webpack/base')),
  dev: require(path.join(__dirname, 'webpack/dev')),
  prod: require(path.join(__dirname, 'webpack/prod')),
  test: require(path.join(__dirname, 'webpack/test'))
};

/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(wantedEnv) {
  let isValid = wantedEnv && wantedEnv.length > 0 && allowedEnvs.indexOf(wantedEnv) !== -1;
  let validEnv = isValid ? wantedEnv : 'dev';
  process.env.REACT_WEBPACK_ENV = validEnv;
  return configs[validEnv];
}

module.exports = buildConfig(env);
