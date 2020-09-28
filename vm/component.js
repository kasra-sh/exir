class Component {
    constructor() {
        if (arguments.length>0) throw Error("Component constructor has no args")
    }
    __instanceRoot__ = global
    __state__ = {}
    __template__ = {}

    get data() {
        return this.__state__
    }

    set data(s) {
        global.dispatchEvent(new CustomEvent('state.set', {detail: this}));
        this.__state__ = s;
    }

    /**
     * @param ctx
     * @return VNode
     */
    view(ctx){}

    created(){}

    mounted(){}

    destroyed(){}

    _renderView() {
        this.__template__ = this.view(this.data)
    }
}