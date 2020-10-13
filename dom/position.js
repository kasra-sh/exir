// const {cls} = require("../dom/classes")
// const {attrs} = require("../dom/attributes")

function left(e) {
    return e.offset
}

function leftWin(e) {
    return e.clientLeft
}

function width(e) {
    return e.offsetWidth
}

function widthWin(e) {
    return e.clientWidth
}

function right(e) {
    return left(e) + width(e)
}

function rightWin(e) {
    return leftWin(e) + widthWin(e)
}

function top(e) {
    return e.clientTop
}

module.exports = {left, leftWin, right, rightWin, width, widthWin}