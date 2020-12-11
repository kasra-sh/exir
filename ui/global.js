import H from "./hscript-minimal"
import {renderDom} from "./render";
import View from "./view";
import VNode from "./vnode";
import mount from "./mount";
global.Exir = {
    View, VNode, jsx, mount, createComponent:View.create, render:renderDom
}
global.h = jsx;
global.jsx = jsx;
global.v = H