import Exir from "../../../vm";
import View from "../../../vm/view";
import core, {showTrace, warn} from "../../../core";
import {renderDom} from "../../../vm/render";

// const jsx = VNode.create

let A = View.create('A', {
    render() {
        return (
            <div>
                <B/>
                <h1 onClick={this.click}>{'{{{{'} AView</h1>
                {this.$children}
                <div id={'adiv'}>Addiiivv<B>O</B></div>
                <><B/></>
                <h1>AView {'}}}}'}</h1>
            </div>
        )
    },
    click() {
        console.log(this)
        console.log(this.$nodes[1])
    }
})

let B = View.create('B', {
    render() {
        return (
            <>
                {'{{{{{{{{{{ '}
                --BView--<br/>
                {this.$children}<br/>
                {'}}}}}}}}}}'}
            </>)
    }
})

let Ajsx = <A>
    <h1>{'{'} AView Ajsx $children Start</h1>
    <h3 id={1}>AChild1</h3>
    <h3>AChild2</h3>
    <h1>AView $children End {'}'}</h1>
</A>
global.app = () => <div>
    <A>
        <B>
            im B in A
        </B>
    </A>
    <B>im B</B>
    {Ajsx}
</div>


global.app = app
global.appRender = A.$render(undefined, undefined, true)

console.log(app)
// console.log(appRender)
global.core = core
// global.renderDom = renderDom
window.addEventListener('load', () => {
    let root = document.getElementById('root')
    global.appDom = renderDom(appRender, root, true)
    warn(appDom)
})
showTrace()