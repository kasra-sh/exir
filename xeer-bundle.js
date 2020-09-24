const scope = require("./core/scope");

scope.setGlobal(require("./index"))
scope.setGlobal(require("./vm"))

require("./ext/stream.ext");
require("./ext/dom.ext");