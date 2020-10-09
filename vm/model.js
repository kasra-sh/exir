const {forEach, contains} = require("../core/collections");
const {isObj, isFun, isArr} = require("../core");

function stateDefinition(def) {
    return {
        value: def
    }
}

function defineSingleState(target, name, def) {
    if (name[0] === '$') {
        throw Error(`"${name}" illegal state field name`)
    }
    const internal = `$${name}`;
    target[internal] = stateDefinition(def);
    Object.defineProperty(target, name, {
        get() {
            return target[internal]
        },
        set(v) {
            target[internal] = v;
            def.value;
        }
    })
}

function state(data={}) {
    if (isFun(data)) {
        return state(data);
    }
    if (!isObj(data) || isArr(data)) {
        throw Error(`data definition must be an object or a function returning an object: ${data}`)
    }

    let _state = {}

    forEach(data, (def, field)=>{
        defineSingleState(_state, field, def);
    })
}