const fs = require("fs");
const write = fs.writeFileSync
const path = require("path");
const iter = require("./ext/stream.ext.codegen")()
const ui = require("./ext/dom.ext.codegen")()
// let f = __filename;
function getPath(file) {
    return path.resolve(__dirname, 'ext',file.replace(path.extname(file), '.js'))
}
const iterPath = getPath('stream.ext.codegen');
const uiPath = getPath('dom.ext.codegen');

if (!global.__X_NODE_GEN__) {
    write(iterPath, iter);
    write(uiPath, ui);
    global.__X_NODE_GEN__ = true
}

module.exports = {
    iterExt: iter, uiExt: ui
}