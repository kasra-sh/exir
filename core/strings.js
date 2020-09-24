const S = {};

S.numRegex = /0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+/
S.getNumberRegex = /(0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+)([a-zA-Z]+)/g

function isNumeric(s) {
    return S.numRegex.test(s)
}

function getNumeric(s) {
    let all = s.matchAll(S.getNumberRegex);
    let arr = [];
    do {
        let m = all.next();
        if (m.done) break;
        arr.push(m);
    } while (true);
    return arr;
}

function startsWith(str, s) {
    return str.indexOf(s) === 0;
}

function endsWith(str, s) {
    return str.indexOf(s) === str.length-1;
}

module.exports = {isNumeric, getNumeric, startsWith, endsWith};