const decimalRegex = /^[-+]?\d*(\.\d+|\d*)(e[-+]?\d+)?$/
const hexRegex = /^[-+]?[a-f0-9]+$/
const octRegex = /^[-+]?[0][0-7]+$/
const binRegex = /^[-+]?[01]+$/
const emailRegex = /^[a-z0-9]([a-z0-9._%-+][a-z0-9]|[a-z0-9])*@[a-z0-9]([a-z0-9.-][a-z0-9]|[a-z0-9])*\.[a-z]{2,6}$/i

function isDecimal(s) {
    return decimalRegex.test(s);
}

function isBinary(s) {
    return binRegex.test(s);
}

function isOctal(s) {
    return octRegex.test(s);
}

function isHex(s) {
    return hexRegex.test(s);
}

function isEmail(s) {
    return emailRegex.test(s);
}

function startsWith(str, s) {
    return str.indexOf(s) === 0;
}

function endsWith(str, s) {
    return str.indexOf(s) === str.length-1;
}

function contains(str, s) {
    return str.indexOf(s)>=0;
}

module.exports = {isDecimal, isHex, isOctal, isBinary, isEmail,startsWith, endsWith, contains};