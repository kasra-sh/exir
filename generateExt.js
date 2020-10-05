const fs = require("fs")
const write = fs.writeFileSync
const {resolve, extname, dirname} = require("path")

function gen(src, dest) {
    const code = require(src)()
    write(dest, code)
}

if (!global.__X_NODE_GEN__) {
    gen('./ext/collections.ext.codegen','./ext/collections.ext.js')
    gen('./ext/dom.ext.codegen', './ext/dom.ext.js')
    gen('./ext/hscript.codegen', './vm/hscript.helpers.js')
    global.__X_NODE_GEN__ = true
}