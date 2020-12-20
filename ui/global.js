import H from "./hscript-minimal"
import {renderDom} from "./render";
import View from "./view_base";
import VNode from "./vnode_base";
import mount from "./mount";

global.Exir = {
    View, VNode, jsx: VNode.create, mount, createComponent:View.create, render:renderDom
}

global.h = VNode.create;
global.jsx = VNode.create;
global.v = H