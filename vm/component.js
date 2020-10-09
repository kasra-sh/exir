import {isFun} from "../core/types";

class Component {
    constructor() {
        this.name = "";
        this.state = {};
        this.view = (ctx)=>"";
    }

    static create({name, state, view}) {
        let c = new Component();
        c.name = name;
        c.state = state;
        if (!isFun(view))
            throw `"Component.view" must be a function: \nComponent:${c} \nview:${view}`;

        c.view = view;
    }
}

module.exports = {Component}