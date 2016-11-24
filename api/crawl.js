/**
 * ScrappyDoo-Node
 *
 * @description Crawler Routes.
 * @author GP
 * @version 0.0.2
 */

/**
 * Module dependencies.
 */

const koaRouter = require('koa-router');
const cheerio = require('cheerio');
const find = require('cheerio-eq');
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
 *
 * @param JSON in format -
 * {
 *   "url": "<url>",
 *   "data": [
 *     {
 *       "name": "<unique_name_1>",
 *       "selector": "<selector>",
 *       "attribute": "<html_attribute>"
 *     },
 *     { ... }
 *   ]
 * }
 * @return JSON in format -
 * {
 *   "<unique_name_1>": "<attribute_value_of_selected_element>",
 *   ...
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
		let returnData = {};
		for (crawlItem of requestBody.data) {
			const matches = find($, crawlItem.selector);
			if (matches && matches.length) {
				returnData[crawlItem.name] = matches.attr(crawlItem.attribute);
			} else {
				returnData[crawlItem.name] = null;
			}
		}
		return ctx.body = returnData;
	});
});

/**
 * Module exports.
 */

module.exports = {
	router
};
