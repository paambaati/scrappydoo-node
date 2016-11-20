/**
 * ScrappyDoo-Node
 *
 * @description Main Configuration.
 * @author GP
 * @version 0.0.1
 */

/**
 * Module dependencies.
 */

const path = require('path');
const merge = require('lodash/fp/object').merge;

// Require environment-specific JSON config files.
const local = require('./env/local');
const development = require('./env/development');
const testing = require('./env/testing');
const preproduction = require('./env/preproduction');
const production = require('./env/production');

/**
 * Settings & defaults.
 * Can be overridden by environment-specific JSON files.
 */

const defaults = {
  SERVER: {
    'port': 6969, // Teehee.
    'trustProxy': false // Set to `true` on production when behind nginx or HAProxy.
  },
  LOG: {
    'path': './logs/scrappy-doo.log',
    'period': '1d', // Rotation period.
    'count': 20, // Number of rotated copies to keep.
    'level': 'info',
    'logToStdout': false,
    'includeCallSiteInfo': false // !CAUTION!: Setting to `true` will make stuff slow, so use with caution.
  }
};

/**
 * Module exports.
 */

module.exports = {
  local: merge(defaults, local),
  dev: merge(defaults, development),
  test: merge(defaults, testing),
  preprod: merge(defaults, preproduction),
  prod: merge(defaults, production)
}[process.env.NODE_ENV || 'local'];
