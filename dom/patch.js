const {isVal, isObj, isEl, hasField} = require("../core/types");
const {forEach} = require("../core/collections");
const {setAttr} = require("./attributes");
const {cls} = require("./classes");
const {error} = require("../core/logging");

function patch(node, object) {
    if (!isVal(node)) {
        error(`Node is ${node}`);
        return;
    }
    if (!isEl(node)) {
        error(`"${node}" is not Element or Node`);
        return;
    }
    if (hasField(object, 'attr')) {
        if (isObj(object['attr'])) {
            forEach(object['attr'], (v, k)=>{
                setAttr(node, k, v);
            })
        }
    }
    if (hasField(object, 'cls')) {
        if (isObj(object['cls'])) {
            let c = cls(node);
            forEach(object['cls'], (v, k)=>{
                c[k](v);
            })
        }
    }
    if (hasField(object, 'prop')) {
        if (isObj(object['prop'])) {
            forEach(object['prop'], (v, k)=>{
                node[k] = v;
            })
        }
    }
}

module.exports = {patch}