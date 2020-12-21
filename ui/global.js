const H = require("./hscript-minimal");
const {renderDom} = require("./render");
const View = require("./view_base");
const VNode = require("./vnode");
const mount = require("./mount");
const store = require("./store");

global.Exir = {
    View, VNode, jsx: VNode.create, mount, createComponent:View.create, render:renderDom, Store: store
}

global.h = VNode.create;
global.jsx = VNode.create;
global.v = H;