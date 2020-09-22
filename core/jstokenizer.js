const {TokenType, Tokenizer} = require("kenpo-js/src/lexer/Tokenizer")

const tokenizer = new Tokenizer({
    symbols: ['(', ')', '[', ']', ',', ':', '=', '==', '!=', '>=', '<=','===', '!==', '.', '...', '-', '+', '/', '*', '&&', '||'],
    literals: [
        {
            name: "STR",
            begin: '"',
            end: ['"'],
            escape: '\\',
            multiline: false
        },
        {
            name: "STR",
            begin: "'",
            end: ["'"],
            escape: "\\",
            multiline: false
        },
        {
            name: "STR",
            begin: "`",
            end: ["`"],
            escape: "\\",
            multiline: true
        },
        {
            name: "REGEX",
            begin: '/',
            end: ['/', '/i', '/g'],
            escape: '\\',
            multiline: false
        },
        {
            name: "COMMENT",
            begin: '//',
            end: ['\n', '\r\n'],
            multiline: false
        },
        {
            name: "COMMENT",
            begin: '/*',
            end: '*/',
            multiline: true
        }
    ],
    postScanners: [
        {
            scan: function (reader) {
                let f = false;
                while (reader.avail()) {
                    if (!validChars.test(reader.readNext())) {
                        reader.pushBack(1);
                        break
                    } else {
                        f = true;
                    }
                }
                return f ? TokenType.WORD : false
            },
            result: function (reader) {
                return {
                    index: reader.mrk,
                    type: TokenType.WORD,
                    text: reader.getCurrentString()
                }
            }
        }
    ]
});

function tokenize(str, whitespace, types) {
    tokenizer.reset(str);
    return tokenizer.getAlltokens(str, whitespace, types);
}

module.exports = {
    tokenize
}