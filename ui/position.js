let E = {};

E.left = function (e) {
    return e.offsetLeft
}

E.width = function (e) {
    return e.offsetWidth
}

E.right = function (e) {
    return E.left(e) + E.width(e)
}

