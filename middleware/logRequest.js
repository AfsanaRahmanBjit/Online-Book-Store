const { log } = require('../server/logger');

function logRequest(req, res, next) {
  log(`${req.method} ${req.originalUrl} was accessed`);
  next();
}

module.exports = { logRequest };