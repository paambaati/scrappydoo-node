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
const cheerio = require('cheerio');
const request = require('request-promise');
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
 * Crawler POST API
 * @param JSON in format -
 * {
 *   url: '<url>',
 *   selector: '<selector>'
 * }
 * @return JSON in format -
 * {
 *   title: '<element title>',
 *   image: '<image uri>'
 * }
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
	let requestOptions = {
		uri: requestBody.url,
		transform: (body) => {
			return cheerio.load(body);
		}
	}
	yield request(requestOptions).then(($) => {
		const matches = $(requestBody.selector);
		if (matches && matches.length) {
			return ctx.body = matches[0].attribs;
		} else {
			ctx.status = 400;
			throw new Error('Bad Request');
		}
	});
});

/**
 * Module exports.
 */

module.exports = {
	router
};
