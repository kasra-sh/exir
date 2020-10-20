/**
 * @module DOM
 * @memberOf dom
 */

/**
 * Element's offsetLeft (relative)
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relLeft(e) {
    return e.offsetLeft
}

/**
 * Element's clientLeft
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absLeft(e) {
    return e.clientLeft
}

/**
 * Element's offsetWidth
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relWidth(e) {
    return e.offsetWidth
}

/**
 * Element's clientWidth
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absWidth(e) {
    return e.clientWidth
}

/**
 * Element's offsetLeft + offsetWidth
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relRight(e) {
    return relLeft(e) + relWidth(e)
}

/**
 * Element's clientLeft + clientWidth
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absRight(e) {
    return absLeft(e) + absWidth(e)
}

/**
 * Element's offsetTop
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relTop(e) {
    return e.offsetTop
}

/**
 * Element's clientTop
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absTop(e) {
    return e.clientTop
}

/**
 * Element's offsetHeight
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relHeight(e) {
    return e.offsetHeight
}

/**
 * Element's clientHeight
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absHeight(e) {
    return e.clientHeight
}

/**
 * Element's offsetTop + offsetHeight
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function relBottom(e) {
    return relTop(e) + relHeight(e)
}

/**
 * Element's clientTop + clientHeight
 * @param {HTMLElement|Element|Node} e
 * @return {number}
 */
function absBottom(e) {
    return absTop(e) + absHeight(e)
}

module.exports = {left: relLeft, leftWin: absLeft, right: relRight, rightWin: absRight, width: relWidth, widthWin: absWidth}