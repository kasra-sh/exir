const core = require('./core');
const dom = require('./dom');
const http = require('./http');
module.exports = {
    X: {
        ...core,
        ...dom,
        ...http
    }
}