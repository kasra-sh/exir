const scope = require("./core/scope");
const core = require('./core');
const ui = require('./ui');
const http = require('./http');
module.exports = scope.mergeAll(
        core, ui, http
)