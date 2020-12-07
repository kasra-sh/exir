// const scope = require("./core/scope")

const index = require("./index")
const hscript = require("./vm/hscript")

// scope.setGlobal({
//     X: {
//         ...index.Core,
//         ...index.Dom,
//         ...index.Http,
//     },
//     // ...index.VM,
//     // H: hscript
// })
global.X = {
    ...index.Core,
    ...index.Dom,
    ...index.Http,
}
global.H = hscript
global.Exir = index.VM
global.jsx = index.VM.jsx

require("./ext/collections.ext")
require("./ext/dom.ext")