class Component {
    constructor() {
        if (arguments.length>0) throw Error("Component constructor has no args")
    }
    __x__ = {}
    __model__ = {}
    __template__ = {}

    model(prop){}

    /**
     * @param ctx
     * @return VNode
     */
    view(ctx){}

    created(){}

    mounted(){}

    destroyed(){}

    _renderView() {
        this.__template__ = this.view(this.model())
    }
}