const fs = require("fs")
const write = fs.writeFileSync
const {resolve, extname, dirname} = require("path")

function gen(src, dest) {
    const code = require(src)()
    write(dest, code)
}

if (!global.__X_NODE_GEN__) {
    let root = dirname(process.argv[1])
    gen('../ext/collections.ext.codegen',root+'/../ext/collections.ext.js')
    gen('../ext/dom.ext.codegen', root+'/../ext/dom.ext.js')
    // gen('./ext/hscript.codegen', './vm/hscript.js')
    const {code, codeES6} = require('../ext/hscript.codegen')()
    write(root+'/../vm/hscript.js', code)
    write(root+'/../vm/hscript-esm.js', codeES6)
    global.__X_NODE_GEN__ = true
}