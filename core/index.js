const scope = require('./scope');
module.exports = scope.mergeAll(
    require('./stream'),
    require('./logging'),
    require('./types'),
    require('./cases'),
    require('./strings')
);
