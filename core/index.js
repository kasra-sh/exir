let stream = require('./collections');
let logging = require('./logging');
let types = require('./types');
let cases = require('./cases');
let strings = require('./strings');
let queryable = require('./queryable');
let functions = require('./functions');
module.exports = {
    ...stream,
    ...logging,
    ...types,
    ...cases,
    ...strings,
    ...queryable,
    ...functions
}
