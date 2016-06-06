if (process.env.NODE_ENV === 'production') {
  module.exports = require('./client-config.prod.js');
} else {
  module.exports = require('./client-config.dev.js');
}
