/**
 * ScrappyDoo-Node
 *
 * @description Error Handling Library.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const cuid = require('cuid');
const logger = require('./logging').logger;

/**
 * Module functions.
 */

/**
 * Quickly log error.
 *
 * @param {Object} Koa context.
 * @param {Error} Error object to log.
 * @api private
 */

function logError(context, error) {
	context.logger.error({
		requestId: context.request.requestId,
		requestMethod: context.request.method,
		requestUrl: context.request.url,
		errorId: context.errorId,
		error,
		errorStatus: context.status,
		stacktrace: error.stack
	}, 'Sending back an error to client!');
}

/**
 * Look ma, error propogation!
 *
 * @return {Function} middleware.
 * @api public
 */

function errorHandler() {
	return function* errorHandlerFunction(next) {
		try {
			yield * next;
			if (this.response.status === 404) {
				this.throw(404);
			}
		} catch (error) {
			this.errorId = cuid.slug().toUpperCase();
			// Default fallback to 500.
			this.status = this.response.status || error.statusCode || 500;
			this.type = 'json';
			this.set('X-Error-Id', this.errorId);
			this.app.emit('error', error, this);
			this.body = {
				error: error.message,
				errorCode: error.code,
				fatalError: error.fatal
			};
			// Also attach stacktrace if in development.
			if (process.env.NODE_ENV === 'development') {
				this.body.errorStacktrace = error.stack;
			}
			logError(this, error);
			return this.body;
		}
	};
}

/**
 * Module exports.
 */

module.exports = {
	errorHandlerMiddleware: errorHandler
};
