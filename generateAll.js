const write = require("fs").writeFileSync
const path = require("path");
const itercode = require("./iter.ext.codegen")()
const uicode = require("./ui.ext.codegen")()
// let f = __filename;
function getPath(f) {
    return path.resolve(__dirname, f.replace(path.extname(f), '.generated.js'))
}
const genPath = getPath(__filename);
// let code = require("./extensions.codegen")();
if (global.__X_NODE_GEN__ === undefined) {
    write(genPath, itercode);
    // eval(code);
    global.__X_NODE_GEN__ = true
}

module.exports = {
    code: itercode,
    file: genPath
}