/**
 * ScrappyDoo-Node
 *
 * @description X-Request-Id Middleware.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const cuid = require('cuid');

/**
 * Module functions.
 */

/**
 * Add a unique collision-resistant ID to
 * the request header to track each request.
 *
 * @return {Function} middleware.
 * @api public
 */

function requestId() {
  return function* requestIdGenerator(next) {
    // Set 'X-Request-Id' header.
    const reqId = cuid().toUpperCase();
    this.set('X-Request-Id', reqId);
    this.request.requestId = reqId;
    yield *next;
  };
}

/**
 * Module exports.
 */

module.exports = {
    requestIdMiddleware: requestId
};
