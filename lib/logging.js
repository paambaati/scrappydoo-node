/**
 * ScrappyDoo-Node
 *
 * @description Logging Library.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const bunyan = require('bunyan');
const config = require('../config/config');

// Initialize default stream as rotated log file.
const streams = [{
  type: 'rotating-file',
  path: config.LOG.path,
  period: config.LOG.period,
  count: config.LOG.count,
  level: config.LOG.level
}];

if (config.LOG.logToStdout) {
  streams.push({
    level: 'debug',
    stream: process.stdout
  });
}

// Serializer for logging the `X-Request-ID` header from response
function responseSerializer(response) {
    if (typeof response == 'string' || response instanceof String) {
        return response;
    } else {
        return response.header['x-request-id'];
    }
}

// Instantiate Bunyan logger instance.
const logger = bunyan.createLogger({
  name: 'scrappyDooLog',
  src: config.LOG.includeCallSiteInfo,
  serializers: {
        requestId: responseSerializer
  },
  streams
});

// Reopen log file-descriptor if external utility is rotating our log file.
process.on('SIGUSR2', () => {
    logger.reopenFileStreams();
});

/**
 * Add the Bunyan logger instance to the middleware stack.
 *
 * @return {Function} middleware.
 * @api public
 */

function loggingMiddleware() {
  return function* loggingGenerator(next) {
    // Attach Bunyan logger to ctx.
    this.logger = logger;
    // Also log all incoming requests for debugging.
    logger.debug({
      'module': 'MIDDLEWARE',
      'request': this.request,
      'requestId': this.request.requestId
    });
    yield* next;
  };
}

/**
 * Module exports.
 */

module.exports = {
    logger,
    loggingMiddleware
};
