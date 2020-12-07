import {Exir, jsx} from "../../vm_deprecated";
import {randomId} from "../../vm_deprecated/util";
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
    onMount() {
        log.info(`${this.props.a} MOUNTED`)
    },
    onDestroy() {
        log.warn(`destroyed ${this.props.a}`)
    }
})