/**
 * ScrappyDoo-Node
 *
 * @description Ping Route.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const koaRouter = require('koa-router');

/**
 * Common variables.
 */

const router = new koaRouter();

/**
 * Routes.
 */

/**
 * Ping API
 */

router.get('/ping', function* ping() {
	return this.body = 'pong';
});

/**
 * Module exports.
 */

module.exports = {
	router
};
