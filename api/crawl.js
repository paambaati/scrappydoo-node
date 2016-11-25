/**
 * ScrappyDoo-Node
 *
 * @description Crawler Routes.
 * @author GP
 * @version 0.0.3
 */

/**
 * Module dependencies.
 */

const koaRouter = require('koa-router');
const logger = require('../lib/logging').logger;
const crawler = require('../lib/crawl');
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
 * Crawler POST API
 */

router.post('/data', function* getMainProductData() {
	let ctx = this;
	const requestBody = ctx.request.body;
	logger.debug({
		'module': moduleName,
		'url': ctx.request.url,
		'requestId': ctx.response,
		'requestBody': requestBody
	}, 'New crawl request.');
	yield crawler.crawl(requestBody.url, requestBody.data).then((response) => {
		return ctx.body = response;
	});
});

/**
 * Module exports.
 */

module.exports = {
	router
};
