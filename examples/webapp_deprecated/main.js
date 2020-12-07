import {Exir} from "../../vm_deprecated";
import App from "./app"
import log from "../../core/logging";
import {div} from "../../vm_deprecated/hscript-esm";

// log.showError()

log.trace(div({}, "Hello HyperScript"))

Exir.mount(App, document.getElementById('root'))