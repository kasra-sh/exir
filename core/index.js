const scope = require('./scope');
module.exports = scope.mergeAll(
    require('./streams'),
    require('./logging'),
    require('./types'),
    require('./cases'),
    require('./strings')
);