import 'regenerator-runtime/runtime'
const scope = require("./core/scope");
// // const X = require("./ui");
// // scope.merge(require("./ui"),X);
// // define window.X
// console.log(require("./ui"))
// scope.setGlobal({
//     X: require("./ui"),
//     I: require("./core/iter"),
//     T: require("./core/types"),
//     Log: require("./core/logging"),
//     Http: require("./http/methods"),
//     S: require("./core/strings"),
//     $stream: require("./core/queryable").of,
//     fmt: require("./template/fmt").Fmt
// });
scope.setGlobal(require("./index"))
// scope.setGlobal(require("./ui/classes"))
// scope.setGlobal(require("./ui/attributes"))
scope.setGlobal(require("./experimental/vm/vnode"))
scope.setGlobal(require("./experimental/vm/vdom"))
// scope.setGlobal({
//     dict: T.dict
// });
// apply extensions and polyfills
require("./iter.ext");
require("./ui.ext");
