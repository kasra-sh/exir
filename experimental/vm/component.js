export class Component {
    constructor() {
        if (arguments.length>0) throw Error("Component constructor has no args")
    }
    __x__ = {}
    __model__ = {}
    model = ()=>{}
    __template__ = {}
    render = ({model})=>{}

    created(){}
    mounted(){}
    destroyed(){}

    update() {}

    static create({model, render}) {
        let c = new Component();
        c.update = ()=>{
            c.model = model();
            c.__template__ = render(c.model);
        }
        return c;
    }
}