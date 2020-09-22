const core = require('./core');
const dom = require('./dom');
const http = require('./http');
module.exports = {
    ...core,
    ...dom,
    ...http
}