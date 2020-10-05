/**
 * @namespace http
 */

const request = require('./request');
const response = require('./response');
const ajax = require('./ajax');
const methods = require('./methods');
const client = require('./client');

module.exports = {
    ...request,
    ...response,
    ...ajax,
    ...methods,
    ...client
}

/**
 * @typedef {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"} HttpMethod
 */

/**
 * @typedef {Object} HttpRequestOptions - Http request arguments
 * @property {HttpMethod} [method]
 * @property {String} [url]
 * @property {Object} [params]
 * @property {Object} [headers]
 * @property {string} [type] - request type "json"|"xml"|"array-buffer"|"blob"|undefined
 * @property {any} [data] - request content data
 * @property {Function} [finish] - finish callback, called after all other callbacks
 * @property {Function} [success] - success callback
 * @property {Function} [fail] - fail callback
 * @property {Function} [progress] - progress callback
 * @property {Function} [prepare] - prepare callback, called before send
 * @property {Function} [uploadProgress] - upload progress callback
 * @property {Function} [uploadFinish] - upload finish callback
 */