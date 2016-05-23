if (process.env.NODE_ENV === 'prod') {
  module.exports = require('./app.prod.js');
} else {
  module.exports = require('./app.dev.js');
}
