const write = require("fs").writeFileSync
const path = require("path");
const code = require("./ext.codegen")()
let f = __filename;
const genPath = path.resolve(__dirname, f.replace(path.extname(f), '.generated.js'));
// let code = require("./extensions.codegen")();
if (global.__X_NODE_GEN__ === undefined) {
    write(genPath, code);
    // eval(code);
    global.__X_NODE_GEN__ = true
}

module.exports = {
    code,
    file: genPath
}