const S = {};

// const numRegex = /^0[xXbB][\daAbBcCdDeEfF]+$|^\d*\.?\d+$/
S.numRegex = /0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+/
S.getNumberRegex = /(0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+)([a-zA-Z]+)/g

S.isNumeric = function (s) {
    return S.numRegex.test(s)
}

S.getNumeric = function (s) {
    let all = s.matchAll(S.getNumberRegex);
    let arr = [];
    do {
        let m = all.next();
        if (m.done) break;
        arr.push(m);
    } while (true);
    return arr;
}

module.exports = S;