import {Exir, jsx} from "../../vm";
import {randomId} from "../../vm/util";
import Random from "./Random";
import {info} from "../../core/logging";

export default Exir.createView('List', {
    state: {
        step: 3,
        count: 0,
        items: []
    },
    render() {
        return <div>
            <button id={randomId()} onClick={this.methods.add}>Add</button>
            <button id={randomId()} onClick={this.methods.remove}>Remove</button>
            <button id={randomId()} onClick={this.methods.refresh}>Refresh</button>
            <p>Count: {this.state.count} ({this.state.count%2===0?(<b>Even</b>):(<u>Odd</u>)})</p>
            <h5>{this.state.items.length} Items</h5>
            {this.state.items.map((it, i)=><><span>{i}{it}</span></>)}
        </div>
    },
    onCreate() {
        info(`${this.$name} created`)
    },
    onUpdate() {
        info(`${this.$name} updated ${this.$instanceId}`)
    },
    methods: {
        refresh() {
            this.setState(state=>{
                let items = []
                for (let i = 0; i < state.count; i++) {
                    items.push(<Random id={randomId()} />)
                }
                state.items = items
                // state.count+=state.step
            })
        },
        add() {
            this.setState(state => {
                for (let i = 0; i < state.step; i++) {
                    state.items.push(<Random id={randomId()} />)
                }
                state.count+=state.step
            })
        },
        remove() {
            this.setState(state => {
                for (let i = 0; i < state.step; i++) {
                    state.items.pop()
                }
                state.count-=state.step
            })
        }
    }
})
