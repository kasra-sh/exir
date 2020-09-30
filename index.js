const core = require('./core');
const dom = require('./dom');
const http = require('./http');
const vm = require('./vm');
module.exports = {
    X: {
        ...core,
        ...dom,
        ...http
    },
    XVM: {
        ...vm
    }
}