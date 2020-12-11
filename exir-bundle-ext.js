// const scope = require("./core/scope")

const index = require("./index")
const hscript = require("./ui/hscript")

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
global.Exir = index.UI
global.jsx = index.UI.jsx

require("./ext/collections.ext")
require("./ext/dom.ext")