const scope = require('../core/scope');
module.exports = scope.mergeAll(
    require('./dom'),
    require('./query'),
    require('./classes'),
    require('./attributes'),
    require('./position')
);