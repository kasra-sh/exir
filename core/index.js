let collections = require('./collections');
let logging = require('./logging');
let types = require('./types');
let cases = require('./cases');
let strings = require('./strings');
let queryable = require('./queryable');
let functions = require('./functions');
module.exports = {
    ...collections,
    ...logging,
    ...types,
    ...cases,
    ...strings,
    ...queryable,
    ...functions
}
/**
 * @namespace core
 */
