const S = require("../core/scope");
const T = require("../core/types");
const I = require("../core/streams");

class Classes {
    static split(className) {
        return className.trim().replace(/\s+/,' ').split(' ');
    }
    constructor(e) {
        this.element = e;
        Object.defineProperty(this, 'items', {
            get() {
                return this.classes;
            },
            set(v) {
                let upd = false;
                if (this.classes) upd = true;
                if (!T.isVal(v) || T.isEmpty(v)) this.classes = [];
                else if (T.isArr(v)) this.classes = v;
                else if (T.isStr(v)) this.classes = Classes.split(v);
                else if (v instanceof DOMTokenList) this.classes = Array.from(v);
                if (upd)
                    this.__update__();
            }
        });
        this.items = e.getAttribute('class');
    }

    static of(e) {
        return new Classes(e)
    }

    __update__() {
        this.element.setAttribute('class', this.classes.join(' '))
    }

    contains(...c) {
        c = I.FlatMap(c);
        return I.All(c, (it)=>I.contains(this.classes, it));
    }

    add(...c) {
        c = I.FlatMap(c);
        I.ForEach(c, (it)=>{
            if (!this.contains(it)) {
                this.classes.push(it.toString());
            }
        });
        this.__update__();
    }

    remove(...c) {
        c = I.FlatMap(c);
        let l = this.classes.length;
        this.classes = I.Filter(this.classes, (it)=>{
            return !I.Any(c, (ci) => ci.endsWith('*')?it.startsWith(ci.replace('*','')):it===ci);
        });
        this.__update__();
        return l !== this.classes.length
    }

    toggle(...c) {
        I.toggle(this.classes, c);
        this.__update__();
    }
}
Object.seal(Classes);

function cls(e) {
    return Classes.of(e);
}

function addClass(e, ...c) {
    Classes.of(e).add(c);
}

function removeClass(e, ...c) {
    Classes.of(e).remove(c);
}

function hasClass(e, ...c) {
    Classes.of(e).contains(c);
}

function toggleClass(e, ...c) {
    Classes.of(e).toggle(c);
}

module.exports = {Classes, cls, addClass, hasClass, removeClass, toggleClass}