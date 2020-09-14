const scope = require('../core/scope');
module.exports = scope.mergeAll(
    require('./query'),
    require('./event'),
    require('./classes'),
    require('./attributes'),
    require('./position'),
    require('./append'),
    require('./patch')
);