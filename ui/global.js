const H = require("./hscript-minimal");
const {createDom} = require("./render");
const {View, createView} = require("./view");
const {VNode, createNode, createText} = require("./vnode");
const {h} = require("./h");
const {render} = require("./render");
const store = require("./store");

global.Exir = {
    View, createView, VNode, createNode, createText, jsx: h, mount: render, createComponent:View.create, renderDom:createDom, Store: store
}

global.h = h;
global.jsx = h;
global.v = H;