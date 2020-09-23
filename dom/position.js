const {cls} = require("../dom/classes")
const {attrs} = require("../dom/attributes")

function left(e) {
    return e.offset
}

function leftW(e) {
    return e.clientLeft
}

function width(e) {
    return e.offsetWidth
}

function widthW(e) {
    return e.clientWidth
}

function right(e) {
    return left(e) + width(e)
}

function rightW(e) {
    return leftW(e) + widthW(e)
}

function translate(e, {x,y,z}) {
    if (x) {

    }
}

module.exports = {left, width, right}