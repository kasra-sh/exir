const scope = require("./core/scope");
const core = require('./core');
const dom = require('./dom');
const http = require('./http');
module.exports = scope.mergeAll(
    core, dom, http
)