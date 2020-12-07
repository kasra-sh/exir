const Core = require('./core');
const Dom = require('./dom');
const Http = require('./http');
// const VM = {
//
// };
module.exports = {
    Core,
    Dom,
    Http,
    VM: require('./vm/exir')
}