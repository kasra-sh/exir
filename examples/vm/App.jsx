import {mount, Component, VNode} from "../../vm/app"
// import P from "./P";
import Container from "./Container";

window.addEventListener('load', () => {
    mount('#root', <Container count={100}/>);
})
