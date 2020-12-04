/**
 * Merges an object with global namespace
 * @private
 * @param {Object} obj
 */
function setGlobal(obj) {
    for (let key of Object.keys(obj)) {
        global[key] = obj[key];
    }
}

/**
 * Code generator for prototype modification, used in polyfills
 */
class Extension {

    /**
     * @constructor
     * @param {any[]} types - Array of prototypes
     */
    constructor(types) {
        this.types = types;
        this.types = []
        /** Generated code */
        this.pcode = "\n"
    }

    /**
     * Defines a new function for given prototypes
     *
     * @param {Function} namedFunc A named function
     * @return {string}
     */
    define(namedFunc) {
        if (!namedFunc.name) {
            let err = `Function must have a name [Extension.define(f)]\n<<${namedFunc}>>`;
            console.error(err);
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
            console.error(err);
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

if (!isBrowser()) {
// -------------
    global.HTMLElement = !global.HTMLElement? function HTMLElement(){}: global.HTMLElement
    global.Element = !global.Element? function Element(){}: global.Element
    global.Node = !global.Node? function Node(){}: global.Node
    global.HTMLCollection = !global.HTMLCollection? function HTMLCollection(){}: global.HTMLCollection
    global.NodeList = !global.NodeList? function NodeList(){}: global.NodeList
// -------------
}

module.exports = {setGlobal, Extension, isBrowser}