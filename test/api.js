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

/**
 * Common variables.
 */

let app = require('../app.js');

/**
 * Helper functions.
 */

const readFile = function readFile(fileName) {
    return fs.readFileSync(fileName).toString();
};

const readJSONFile = function readJSONFile(fileName) {
    return JSON.parse(readFile(fileName));
};

const getFixtures = function getFixtures(testName) {
    return {
        'html': readFile(`test/mocks/${testName}.html`),
        'json': readJSONFile(`test/mocks/${testName}.json`)
    };
};

const setStubs = function setStubs(testName) {
    if (testName) {
        const fixtures = getFixtures(testName);
        // Stub the 'getPage()' method.
        // Return a fixture from `test/mocks` instead.
        const mockPageResponse = function mockPageResponse() {
            return Promise.resolve(fixtures['html']);
        };
        td.when(getPage(td.matchers.anything())).thenReturn(mockPageResponse());
        
        const dummyResponse2 = function dummyResponse2() {
            return Promise.resolve({'sample': ['BOOM', 'SHAKA', 'LAKA']});
        };
        td.when(crawl(td.matchers.anything(), td.matchers.anything())).thenReturn(dummyResponse2());
        
    }
    app = require('../app.js');
};

const stopApp = function(app) {
    app.close();
};

/**
 * Setup.
 */

const libCrawl = td.replace('../lib/crawl');
const getPage = libCrawl.getPage;
const crawl = libCrawl.crawl;
const requestOptions = {
    url: 'https://reddit.com/',
    transform: (body) => {
        return libCrawl.load(body);
    }
};

/**
 * Library Tests.
 */

/*test('LIB ➡️ getPage()', (assert) => {
    getPage(requestOptions).then((response) => {
        console.log('ALL OK');
        assert.end();
    });
});*/

/**
 * API Tests.
 */

test('API ➡️ GET /ping', (assert) => {
    assert.plan(2);
    const expectedResult = 'pong';
    request(app)
        .get('/ping')
        .expect(200)
        .expect('Content-Type', /text/)
        .end(function (err, res) {
            const actualResult = res.text;
            assert.error(err, 'No Errors');
            assert.same(actualResult, expectedResult, 'Ping Response');
            assert.end();
        });
});

test('API ➡️ GET /<random>', (assert) => {
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
            assert.same(actualResult, expectedResult, 'Not Found Response');
            assert.end();
        });
});

test('API ➡️ POST /data', (assert) => {
    const testName = 'reddit_1';
    const testData = getFixtures(testName);
    stopApp(app);
    setStubs(testName);
    assert.plan(2);
    request(app)
        .post('/api/data')
        .send(testData['INPUT'])
        .expect(200)
        .expect('Content-Type', /application\/json; charset=utf-8/)
        .end(function (err, res) {
            assert.error(err, 'No Errors');
            const expectedResult = testData['OUTPUT'];
            const actualResult = res.body;
            assert.same(actualResult, expectedResult, 'Crawl Response');
            assert.end();
    });
});

test('⏹ TEARDOWN', (test) => {
  td.reset();
  app.close();
  test.end();
});
