const Core = require('./core');
const Dom = require('./dom');
const Http = require('./http');
const VM = {
    ...require('./vm/component'),
    ...require('./vm/vnode'),
    ...require('./vm/utility'),
    ...require('./vm/renderer'),
    ...require('./vm/app')
};
module.exports = {
    Core,
    Dom,
    Http,
    VM
}