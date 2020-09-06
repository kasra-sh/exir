const Log = require("./logging")
function merge(src, target) {
    for (let k of Object.keys(src)) {
        if ((!src[k] instanceof Array) && (typeof src[k] === "object")) {
            if (!target.hasOwnProperty(k)) target[k] = {}
            merge(src[k], target[k]);
        } else
            target[k] = src[k]
    }
    return target;
}
function mergeAll(...obj) {
    let res = {};
    for (let o in obj) {
        merge(o, res);
    }
    return res;
}
function setGlobal(obj) {
    merge(obj, global);
}

class Extension {
    types = []
    pcode = "\n"

    constructor(types) {
        this.types = types;
    }

    /**
     *
     * @param namedFunc {Function}
     * @return {string}
     */
    define(namedFunc) {
        if (!namedFunc.name) {
            let err = `Function must have a name [Extension.define(f)]\n<<${namedFunc}>>`;
            Log.error(err);
            return `\n/**\n *${err}\n */`;
        }
        let code = "\n";
        for (let p of this.types) {
            if (p !== undefined)
                code += `${p.name || p}.prototype.${namedFunc.name} = `;
        }
        code += namedFunc.toString() + ";\n";

        this.pcode += code;

        return code
    }

    polyfill(namedFunc) {
        if (!namedFunc.name) {
            let err = `Extension function must have a name:\n<<${namedFunc}>>`;
            Log.error(err);
            return `\n/**\n *${err}\n */`;
        }
        let code = "\n";
        for (let p of this.types) {
            code += `if (${p.name || p}.prototype.${namedFunc.name} === undefined) ${p.name || p}.prototype.${namedFunc.name} = ${namedFunc.toString()};\n`;
        }
        this.pcode += code;
    }
}

function isBrowser() {
    return global.window !== undefined && global.document !== undefined && global.navigator !== undefined
}

module.exports = {merge, mergeAll, setGlobal, Proto: Extension, isBrowser}