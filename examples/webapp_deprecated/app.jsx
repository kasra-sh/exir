import {Exir, jsx} from "../../vm_deprecated"
import List from "./List";
import Router from "./Router";
import Route from "./Route";

export default Exir.createView('App', {
    state: {
        router: undefined
    },
    render() {
        return <div>
            <h3 style={{textAlign: 'center'}}>WebApp Example</h3>
            <div style={'text-align: center'}>
                <button onClick={this.click1}>R1</button>
                <button onClick={this.click2}>R2</button>
                <Router rootPath={"/"} init={this.routerInit.bind(this)}>
                    <Route path={"hi"}>
                        <h1>Route 1</h1>
                        <List/>
                    </Route>
                    <Route path={"bye"}>
                        <h1>Route 2</h1>
                    </Route>
                </Router>
            </div>
        </div>
    },
    onCreate() {
        // this.click = this.click.bind(this)
        // this.routerInit = this.routerInit.bind(this)
    },
    click1() {
        this.state.router.route('hi')
    },
    click2() {
        this.state.router.route('bye')
    },
    routerInit(r) {
        this.state.router = r
        console.log(this.state)
    },
    methods: {

    }
})