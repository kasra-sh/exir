let request = require('./request');
let response = require('./response');
let ajax = require('./ajax');
let methods = require('./methods');
let client = require('./client');
module.exports = {
    ...request,
    ...response,
    ...ajax,
    ...methods,
    ...client
}
console.log(module.exports)