import {Component, VNode} from "../../vm/app";

export default class P extends Component {
    view(ctx) {
        return (<p
            className="paragraph"
            style={{display: "inline", marginRight: `${ctx.margin || 5}px`, whiteSpace: "nowrap"}}>
            {ctx.text || "Empty!"}
        </p>)
    }
}