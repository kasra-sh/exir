import {Component, VNode} from "../../vm/app";
// import {VNode} from "../../vm/vnode";
import Banner from "./Banner";
import P from "./P";

export default class Container extends Component {
    view(ctx) {
        let ch = [];
        for (let i = 0; i < ctx.count; i++) {
            ch.push(<P text={"Paragraph " + i} margin={i * 2}/>)
        }
        return (
            <fragment>
                <div
                    className="a b"
                    style={{display: "block", overflow: "scroll", maxWidth: "100%", height: '150px'}}>
                    <Banner/>
                    {JSON.stringify(ctx)}
                    {[...ch]}
                </div>
                <h5>EEMMPPTTYY</h5>
            </fragment>
        )
    }
}