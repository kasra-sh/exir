const scope = require("./core/scope")

const index = require("./index")
const hscript = require("./vm/hscript.helpers")

scope.setGlobal({
    X: {
        ...index.Core,
        ...index.Dom,
        ...index.Http
    },
    VM: {
        ...index.VM,
        ...hscript
    }
})

require("./ext/collections.ext")
require("./ext/dom.ext")