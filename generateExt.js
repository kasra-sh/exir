const fs = require("fs");
const write = fs.writeFileSync
const path = require("path");
const stream = require("./ext/collections.ext.codegen")()
const dom = require("./ext/dom.ext.codegen")()

function getPath(file) {
    return path.resolve(__dirname, 'ext',file.replace(path.extname(file), '.js'))
}

const streamPath = getPath('collections.ext.codegen');
const domPath = getPath('dom.ext.codegen');

if (!global.__X_NODE_GEN__) {
    write(streamPath, stream);
    write(domPath, dom);
    global.__X_NODE_GEN__ = true
}