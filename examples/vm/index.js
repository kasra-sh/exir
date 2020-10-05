const X = require('../../vm');
const {e} = require('../../vm/hscript.helpers');

const C = {
    view:() => e('div#div1.a.b.sadas',{}, e('',{}, "Some Text"))
}
window.addEventListener('load', ()=>{
    X.mount('#root', C);
    X.mount('#root', C);
    X.mount('#root', C);
})
