/**
 * @module DOM
 * @memberOf dom
 */
const T = require("../core/types");
const {toggle, any, all, contains, filter, flatMap, forEach} = require("../core/collections");

/**
 * Element classes CRUD wrapper
 * @memberOf dom
 */
class Classes {
    /**
     * Split element `className`
     * @param className
     * @return {String[]}
     */
    static split(className) {
        return className.trim().replace(/\s+/,' ').split(' ');
    }

    /**
     * @param {HTMLElement|Element|Node} e - element
     */
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

    /**
     * Equivalent of `new Classes(e)`
     * @param e
     * @return {dom.Classes}
     */
    static of(e) {
        return new Classes(e)
    }

    __update__() {
        this.element.setAttribute('class', this.classes.join(' '))
    }

    /**
     * Element has class(es)
     * @param {String} c - class(es)
     * @return {boolean}
     */
    contains(...c) {
        c = flatMap(c);
        return all(c, (it)=>contains(this.classes, it));
    }

    /**
     * Add class(es)
     * @param {String} c - class(es)
     */
    add(...c) {
        c = flatMap(c);
        forEach(c, (it)=>{
            if (!this.contains(it)) {
                this.classes.push(it.toString());
            }
        });
        this.__update__();
    }

    /**
     * Remove class(es)
     * @param {String} c - class(es)
     * @return {boolean}
     */
    remove(...c) {
        c = flatMap(c);
        let l = this.classes.length;
        this.classes = filter(this.classes, (it)=>{
            return !any(c, (ci) => ci.endsWith('*')?it.startsWith(ci.replace('*','')):it===ci);
        });
        this.__update__();
        return l !== this.classes.length
    }

    /**
     * Toggle class(es) - if exists toggle else adds
     * @param {String} c - class(es)
     */
    toggle(...c) {
        toggle(this.classes, c);
        this.__update__();
    }
}
Object.seal(Classes);

/**
 * Equivalent of `[new Classes(e)]{@link dom.Classes}`
 * @param e
 * @return {dom.Classes}
 */
function cls(e) {
    return Classes.of(e);
}

/**
 * Add class(es) [cls(e).add()]{@link dom.Classes#add}
 * @param {HTMLElement|Element|Node} e - element
 * @param c
 */
function addClass(e, ...c) {
    Classes.of(e).add(c);
}

/**
 * Remove class(es) [cls(e).remove()]{@link dom.Classes#remove}
 * @param {HTMLElement|Element|Node} e - element
 * @param c
 */
function removeClass(e, ...c) {
    Classes.of(e).remove(c);
}

/**
 * Has class(es) [cls(e).contains()]{@link dom.Classes#contains}
 * @param {HTMLElement|Element|Node} e - element
 * @param c
 */
function hasClass(e, ...c) {
    Classes.of(e).contains(c);
}

/**
 * Toggle classes [cls(e).toggle()]{@link dom.Classes#toggle}
 * @param {HTMLElement|Element|Node} e - element
 * @param c
 */
function toggleClass(e, ...c) {
    Classes.of(e).toggle(c);
}

module.exports = {Classes, cls, addClass, hasClass, removeClass, toggleClass}