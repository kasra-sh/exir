const app = require('./app');
const vnode = require('./vnode');
const component = require('./component');
const context = require('./context');
const exir = require('./renderer');
const utility = require('./utility');
// const hs = require('../')

module.exports = {
    ...app,
    ...vnode,
    ...component,
    ...context,
    ...exir,
    ...utility
}