import 'regenerator-runtime/runtime'
// require("./index");
const scope = require("./core/scope");
const X = require("./ui/query");
scope.merge(require("./ui/dom"),X);
// define window.X
scope.setGlobal({
    X,
    I: require("./core/iter"),
    T: require("./core/types"),
    Log: require("./core/logging"),
    Http: require("./http/methods").Http,
    S: require("./core/strings"),
    $stream: require("./core/queryable").of,
    fmt: require("./template/fmt").Fmt
});
scope.setGlobal(require("./ui/classes"))
scope.setGlobal(require("./ui/attributes"))
scope.setGlobal(require("./experimental/vm/vnode"))
scope.setGlobal(require("./experimental/vm/vdom"))
scope.setGlobal({
    dict: T.dict
});
// apply extensions and polyfills
require("./ext.codegen");
