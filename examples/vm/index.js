// cd to project root:
// parcel examples/vm/index.html

const {VNode, Component, mount} = require('../../vm');
const e = VNode.create;
// const {Component, m} = require("../../vm");
// const {e} = require('../../vm/hscript.helpers');

class Z extends Component {
    view() {
        return e('h1', {}, 'Banner')
    }
}
//
// console.log(Z, Component)

const P = {
    view:(ctx)=> e('p.paragraph',
        {style: {display: "inline", marginRight: `${ctx.margin||5}px`, whiteSpace: "nowrap"}},
        ctx.text || "Empty!")
}

const C = {
    view:(ctx) => {
        let ch = [];
        for (let i=0;i<ctx.count;i++) {
            ch.push(e(P, {text: "Paragraph " + i, margin: i*2}))
        }

        return e('div#container.a.b',
            {style: {display: "block", overflow: "scroll", maxWidth: "100%", height: '150px'}},
            [e(Z, {}),JSON.stringify(ctx),...ch])
    }
}

window.addEventListener('load', ()=>{
    mount('#root', e(C, {count: 100}));
    // X.mount('#root', C);
    // X.mount('#root', C);
})
