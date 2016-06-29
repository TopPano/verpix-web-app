/* eslint no-console: 0, no-var: 0 */

// Register babel to have ES6 support on the server
require('babel-register');
require('babel-polyfill');

// Prevent issues with libraries using this var
delete process.env.BROWSER;

if (process.env.NODE_ENV === 'production') {
  require('./production.js');
} else {
  require('./development.js');
}
