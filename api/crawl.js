/**
 * ScrappyDoo-Node
 *
 * @description Crawler Routes.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const koaRouter = require('koa-router');
const logger = require('../lib/logging').logger;
const config = require('../config/config');


/**
 * Common variables.
 */

const moduleName = 'CRAWLER';

/**
 * Routes.
 */

const router = new koaRouter({
	prefix: '/api'
});

/**
 * Crawler API
 */

router.get('/data', function* getMainProductData() {
	let ctx = this;
	logger.debug({
		'module': moduleName,
		'url': ctx.request.url,
		'requestId': ctx.response
	}, 'New crawl request.');
	ctx.body = 'Yabba dabba doo!';
});

/**
 * Module exports.
 */

module.exports = {
	router
};
