let app = require('./app');
let vnode = require('./vnode');
let component = require('./component');
let context = require('./context');

module.exports = {
    XVM: {
        ...app,
        ...vnode,
        ...component,
        ...context
    }
}