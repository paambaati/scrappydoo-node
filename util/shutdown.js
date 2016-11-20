/**
 * ScrappyDoo-Node
 *
 * @description Process Shutdown/Kill Handler Utility.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const logger = require('../lib/logging').logger;

/**
 * Module functions.
 */

/**
 * Gracefully close the HTTP server before exiting.
 *
 * @param {String} signal.
 * @param {Object} HTTP server instance.
 * @api public
 */

function gracefulShutdown(signal, server) {
  logger.warn({
    module: 'SHUTDOWN',
    signal
  },
  'Process killed! Trying to gracefully shutdown now...');
  // Close the HTTP server.
  server.close();
  // Finally, exit cleanly.
  process.exit(0);
};

/**
 * Module exports.
 */

module.exports = {
    shutdown: gracefulShutdown
}
