/**
 * @module DOM
 * @memberOf dom
 */

/**
 * Append node(s) to parent and dispatch an event
 * @param {HTMLElement|Element|Node} parent - parent element
 * @param {HTMLElement|Element|Node} elements - appended children
 */
function append(parent, ...elements) {
    window.dispatchEvent(new CustomEvent("x.dom.append", {detail: {parent, elements}}))
    parent.append(...elements);
}

module.exports = {append}