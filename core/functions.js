
function bodyOf(func) {
    return func.toString().match(/{[\w\W]*}/)[0]
}

function bodyEquals(f1, f2) {
    return bodyOf(f1) === bodyOf(f2)
}

const nameRegex = /^[$\w_][0-9\w_$]*$/i;
const validChars = /[\w$_0-9]/i

module.exports = {
    bodyOf,
    bodyEquals
}