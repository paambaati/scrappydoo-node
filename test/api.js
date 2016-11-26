/**
 * ScrappyDoo-Node
 *
 * @description API Tests.
 * @author GP
 * @version 0.0.1
 */

'use strict';

/**
 * Module dependencies.
 */

const fs = require('fs');
const test = require('tape');
const request = require('supertest');
const td = require('testdouble');
const libCrawl = require('../lib/crawl');
/**
 * Common variables.
 */

let app = require('../app.js');
const useStubs = true;

/**
 * Helper functions.
 */

/**
 * Read file synchronously.
 * @param String - file name.
 * @returns String - file content.
 */

const readFile = function readFile(fileName) {
    return fs.readFileSync(fileName).toString();
};

/**
 * Read JSON file synchronously.
 * @param String - file name.
 * @returns Object - JSON.
 */

const readJSONFile = function readJSONFile(fileName) {
    return JSON.parse(readFile(fileName));
};

/**
 * Gets fixtures & mocks for a given test case.
 * @param String - test case name.
 * @returns Object - fixtures.
 */

const getFixtures = function getFixtures(testName) {
    return {
        'html': readFile(`test/mocks/${testName}.html`),
        'json': readJSONFile(`test/mocks/${testName}.json`)
    };
};

/**
 * Sets up stubs for all API calls that use the crawl library.
 * @param String - test case name.
 * @returns null
 */

const setStubs = function setStubs(testName) {
    if (useStubs) {
        const fixtures = getFixtures(testName);

        // Read HTML from fixture file, and not an external HTTP(S) resource.
        const dummyGetPage = function dummyGetPage(options) {
            return Promise.resolve(fixtures['html']);
        };

        // Get crawl function to use the dummyGetPage stub.
        const dummyCrawl = function dummyCrawl(url, data) {
            return dummyGetPage(url).then((html) => {
                const $ = libCrawl.load(html);
                return libCrawl.getElements($, data);
            });
        }
        td.replace(libCrawl, 'getPage', dummyGetPage);
        td.replace(libCrawl, 'crawl', dummyCrawl);
        app = require('../app');
    }
};

/**
 * Removes all stubs/mocks.
 * @returns null
 */

const removeStubs = function removeStubs() {
    td.reset();
    app = require('../app');
};

/**
 * API Tests.
 */

test('API ➡️  GET /ping', (assert) => {
    assert.plan(2);
    const expectedResult = 'pong';
    request(app)
        .get('/ping')
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function (err, res) {
            const actualResult = res.text;
            assert.error(err, '✅  No Errors');
            assert.same(actualResult, expectedResult, '✅  Ping Response');
            assert.end();
        });
});

test('API ➡️  GET /<random>', (assert) => {
    assert.plan(1);
    const expectedResult = {
        'error': 'Not Found'
    };
    request(app)
        .get('/jinkies') // Non-existent URL.
        .expect(404)
        .expect('Content-Type', /application\/json; charset=utf-8/)
        .end(function (err, res) {
            const actualResult = res.body;
            assert.same(actualResult, expectedResult, '✅  404 Not Found Response');
            assert.end();
        });
});

test('API ➡️  POST /data (Correct Data)', (assert) => {
    const testName = 'reddit_1';
    const testData = getFixtures(testName);
    setStubs(testName);
    assert.plan(2);
    request(app)
        .post('/api/data')
        .send(testData['json']['INPUT'])
        .expect(200)
        .expect('Content-Type', /application\/json; charset=utf-8/)
        .end(function (err, res) {
            assert.error(err, '✅  No Errors');
            const expectedResult = testData['json']['OUTPUT'];
            const actualResult = res.body;
            assert.same(actualResult, expectedResult, '✅  Crawl Response');
            assert.end();
        });
});

test('API ➡️  POST /data (Missing Data)', (assert) => {
    const testName = 'github_1';
    const testData = getFixtures(testName);
    setStubs(testName);
    assert.plan(2);
    request(app)
        .post('/api/data')
        .send(testData['json']['INPUT'])
        .expect(200)
        .expect('Content-Type', /application\/json; charset=utf-8/)
        .end(function (err, res) {
            assert.error(err, '✅  No Errors');
            const expectedResult = testData['json']['OUTPUT'];
            const actualResult = res.body;
            assert.same(actualResult, expectedResult, '✅  Crawl Response');
            assert.end();
        });
});

test('⏹ TEARDOWN', (test) => {
    td.reset();
    app.close();
    test.end();
});
