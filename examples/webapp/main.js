import mount from "../../vm/mount";
import App from "./App";
import {showError, showTrace} from "../../core";

showTrace()
window.addEventListener('load', function (){
    console.log(App)
    mount(App, document.getElementById('root'))
})
