import Exir from "../../ui"

export default Exir.createComponent('Child', {
    props: {
        name: "",
        type: "div"
    },
    render() {
        return VNode.create(this.props.type, {}, <b>{this.props.name}</b>)
    },
    // shouldUpdate() {
    //     // return true
    // }
})