import {Exir, jsx} from "../../vm"
import List from "./List";

export default Exir.createView('App',{
    render:()=><>
        <h3 style={{textAlign: 'center'}}>WebApp Example</h3>
        <div style={'text-align: center'}>

            <List/>

        </div>
    {/*<div>AAA</div>*/}
</>})