const scope = require("./core/scope")

const index = require("./index")
// const hscript = require("./vm/hscript.helpers")

scope.setGlobal({
    X: {
        ...index.Core,
        ...index.Dom,
        ...index.Http,
    },
    ...index.VM
})

// require("./ext/collections.ext")
// require("./ext/dom.ext")