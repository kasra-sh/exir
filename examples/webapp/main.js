import {Exir} from "../../vm";
import App from "./app"
import log from "../../core/logging";
import {div} from "../../vm/hscript-esm";

// log.showError()

log.trace(div({}, "Hello HyperScript"))

Exir.mount(App, document.getElementById('root'))