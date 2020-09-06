const scope = require("./core/scope");

module.exports = function (extensions = false) {
    if (extensions) {
        require('./ext.generated');
    }
    return scope.mergeAll(
        require('./ui'),
        require('./core')
    );
}