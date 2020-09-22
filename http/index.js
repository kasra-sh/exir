const scope = require('../core/scope');

module.exports = scope.mergeAll(
    ...require('./request'),
    ...require('./response'),
    ...require('./ajax'),
    ...require('./methods'),
    ...require('./client')
)