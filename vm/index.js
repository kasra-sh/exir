const app = require('./app');
const vnode = require('./vnode');
const component = require('./component');
const context = require('./context');
const xeer = require('./xeer');
// const hs = require('../')

module.exports = {
    ...app,
    ...vnode,
    ...component,
    ...context,
    ...xeer
}