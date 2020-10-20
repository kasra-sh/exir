/**
 * @module DOM
 * @memberOf dom
 */
const {error} = require("../core/logging");
const {forEach} = require("../core/collections");
const {isVal, isArr, isObj, isEl, hasField} = require("../core/types");
const {setAttr} = require("./attributes");
const {setEvent} = require("./event");
// const {cls} = require("./classes");
const ATR = 'atr'
const CLS = 'cls'
const EVT = 'evt'

/**
 * Modify a DOM element/node
 * @param {HTMLElement|Element|Node} node - DOM element/node
 * @param {Object} object - patch data {atr: Attributes, cls: Classes, evt: Events}
 */
function patch(node, object) {
    if (!isVal(node)) {
        error(`Node is ${node}`)
        return
    }
    if (!isEl(node)) {
        error(`"${node}" is not Element or Node`);
        return
    }
    if (hasField(object, ATR)) {
        if (isObj(object[ATR])) {
            forEach(object[ATR], (v, k)=>{
                setAttr(node, k, v)
            })
        }
    }
    if (hasField(object, CLS)) {
        const cls = object[CLS];
        if (isArr(cls)){
            node.className = cls.join(' ')
        } else {
            node.className = cls
        }
    }
    if (hasField(object, EVT)) {
        if (isObj(object[EVT])) {
            forEach(object[EVT], (v, k)=>{
                setEvent(node, k, v)
            })
        }
    }
}

module.exports = {patch}