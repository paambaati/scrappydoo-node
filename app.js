#! /usr/bin/env node

/**
 * ScrappyDoo-Node
 *
 * @description Main Server Entrypoint for ScrappyDoo.
 * @author GP
 * @version 0.0.1
 */

// Get everyone to use Bluebird so that promises are crazy-fast.
global.Promise = require('bluebird');

// Log unhandled exceptions & shutdown with exit code 1.
process.on('uncaughtException', (error) => {
	if (error.code === 'EADDRINUSE') {
		console.error(`Could not start ScrappyDoo because the port ${error.port} is already in use!`);
	} else {
		console.error('Something unexpected happened! Those meddling kids!');
		console.error(error);
	}
    process.exit(1);
});

/**
 * Common variables.
 */

const env = process.env.NODE_ENV;
const moduleName = 'SERVER';

/**
 * Main dependencies.
 */

const koa = require('koa');
const koaMount = require('koa-mount');
const koaRouter = require('koa-router')();
const koaBody = require('koa-body');
const logging = require('./lib/logging');
const logger = logging.logger;
const shutdown = require('./util/shutdown').shutdown;
const config = require('./config/config');
// Middleware.
const errors = require('./lib/errors');
const requestId = require('./lib/request-id');
const responseTime = require('./lib/response-time');
// API Routes.
const pingRouter = require('./api/ping').router;
const crawlRouter = require('./api/crawl').router;

// Koa Initialization.
const app = koa();

/**
 * Middleware.
 */

app.use(koaBody());
app.use(responseTime.responseTimeMiddleware());
app.use(requestId.requestIdMiddleware());
app.use(logging.loggingMiddleware());
app.use(errors.errorHandlerMiddleware());

/**
 * Routes
 */
app.use(koaRouter.allowedMethods());
app.use(pingRouter.routes());
app.use(crawlRouter.routes());

/**
 * Koa Server Settings.
 */

app.on('error', (err, ctx) => logger.error({
	module: moduleName
}, 'Something went tits up', err, ctx));

app.name = 'ScrappyDoo-Node';
app.proxy = config.SERVER.trustProxy;

// Spin up the main Koa server.
const server = app.listen(process.env.PORT || config.SERVER.port);

// Attach SIGTERM/SIGINT handlers for graceful shutdowns.
process.on('SIGTERM', () => shutdown('SIGTERM', server));
process.on('SIGINT', () => shutdown('SIGINT', server));

logger.info({
	module: moduleName,
	port: config.SERVER.port,
	environment: env || 'NOT_SET'
}, 'Server\'s up mate!');
