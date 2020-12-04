import {Exir, jsx} from "../../vm";
import {randomId} from "../../vm/util";
import log from "../../core/logging";

export default Exir.createView('Random', {
    props: {a: 0},
    render() {
        return <div>
            <b id={this.props.a}>{randomId()}</b>
        </div>
    },
    // shouldUpdate() {
    //     return true
    // },
    onUpdate() {
        log.warn(`updated ${this.props.a}`)
    },
    onDestroy() {
        log.warn(`destroyed ${this.props.a}`)
    }
})