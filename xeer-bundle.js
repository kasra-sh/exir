const scope = require("./core/scope");

scope.setGlobal(require("./index"))
scope.setGlobal(require("./vm/vnode"))
scope.setGlobal(require("./experimental/vm/vdom"))

require("./ext/stream.ext");
require("./ext/dom.ext");