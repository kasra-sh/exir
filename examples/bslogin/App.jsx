import Exir from "../../vm/exir"
import Form from "./Form";
import "./signin.css"
import "../assets/dist/css/bootstrap.min.css"

const App = Exir.createComponent('App', {
    state: {
        isValid: false
    },
    render() {
        return <div className={'text-center m-auto'}>
            <h4>{"is valid? "+this.state.isValid}</h4>
            <Form callback={this.validState.bind(this)} />
            </div>
    },
    validState(valid) {
        this.state.isValid = valid
        this.$update()
    }
})

window.addEventListener('load', function () {
    Exir.mount((
        <div className={'text-center m-auto'}><App/></div>
    ), document.getElementById('root'))
})