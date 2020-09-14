let E = {};

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

module.exports = {left, width, right}