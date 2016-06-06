if (process.env.NODE_ENV === 'production') {
  module.exports = require('./external-api-config.prod.js');
} else {
  module.exports = require('./external-api-config.dev.js');
}
