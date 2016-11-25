/**
 * ScrappyDoo-Node
 *
 * @description Crawler Library.
 * @author GP
 * @version 0.0.1
 */

'use strict';

/**
 * Module dependencies.
 */
const request = require('request-promise');
const cheerio = require('cheerio');
const find = require('cheerio-eq');

/**
 * Functions.
 */

/**
 * Loads HTML text to Cheerio as a parse-able virtual DOM.
 * @param HTML as text.
 * @return Virtual DOM as Cheerio object.
 */

const load = function load(requestBody) {
    return cheerio.load(requestBody);
};

/**
 * Promise-function that makes a HTTP(s) request and returns the response.
 * @param Request options.
 * @return HTTP Response as promise.
 */

const getPage = function getPage(options) {
    return request(options);
};

/**
 * Promise-function that crawls webpage and harvests elements.
 * @param url URL to crawl.
 * @param data JSON body. should be in format -
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

const crawl = function crawl(url, data) {
    let requestOptions = {
		uri: url,
		transform: (body) => {
			return load(body);
		}
	}
    return getPage(requestOptions).then(($) => {
		let returnData = {};
        for (const crawlItem of data) {
			const matches = find($, crawlItem.selector);
			if (matches && matches.length) {
				returnData[crawlItem.name] = matches.attr(crawlItem.attribute);
			} else {
				returnData[crawlItem.name] = null;
			}
		}
		return returnData;
	});
}

/**
 * Module exports.
 */

module.exports = {
    getPage,
    load,
	crawl
};
