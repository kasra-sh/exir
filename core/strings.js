const decimalRegex = /^[-+]?\d*(\.\d+|\d*)(e[-+]?\d+)?$/
const hexRegex = /^[-+]?[a-f0-9]+$/
const octRegex = /^[-+]?[0][0-7]+$/
const binRegex = /^[-+]?[01]+$/
const emailRegex = /^[a-z0-9]([a-z0-9._%-+][a-z0-9]|[a-z0-9])*@[a-z0-9]([a-z0-9.-][a-z0-9]|[a-z0-9])*\.[a-z]{2,6}$/i
/**
 * @module core/strings
 * @memberOf core
 */


/**
 * String is decimal number
 * @param {String} str
 * @return {boolean}
 */
function isDecimal(str) {
    return decimalRegex.test(str);
}

/**
 * String is binary number
 * @param {String} str
 * @return {boolean}
 */
function isBinary(str) {
    return binRegex.test(str);
}

/**
 * String is octal number
 * @param {String} str
 * @return {boolean}
 */
function isOctal(str) {
    return octRegex.test(str);
}

/**
 * String is hexadecimal number
 * @param {String} str
 * @return {boolean}
 */
function isHex(str) {
    return hexRegex.test(str);
}

/**
 * String is valid email address
 * @param {String} str
 * @return {boolean}
 */
function isEmail(str) {
    return emailRegex.test(str);
}

/**
 * String starts with sequence polyfill
 * @param {String} str
 * @param {String} seq
 * @return {boolean}
 */
function startsWith(str, seq) {
    return str.indexOf(seq) === 0;
}

/**
 * String ends with sequence polyfill
 * @param {String} str
 * @param {String} seq
 * @return {boolean}
 */
function endsWith(str, seq) {
    return str.indexOf(seq) === seq.length-1;
}

/**
 * String contains sequence
 * @param {String} str
 * @param {String} seq
 * @return {boolean}
 */
function contains(str, seq) {
    return str.indexOf(seq)>=0;
}

module.exports = {isDecimal, isHex, isOctal, isBinary, isEmail,startsWith, endsWith, contains};