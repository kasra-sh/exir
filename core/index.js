const scope = require('./scope');
module.exports = scope.mergeAll(
    require('./iter'),
    require('./logging'),
    require('./types'),
    require('./cases'),
    require('./strings')
);