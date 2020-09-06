const win = window || global;

win.___xest___ = {}
win.___xests___ = {}
win.___count___ = 0
win.___done___ = []
function equals(a, b) {
    if (typeof a !== typeof b) return false;
    if (typeof a === "object" && typeof b === "object") {
        const keys = Object.keys(a);
        if (keys.length < Object.keys(b).length) return false;
        return keys.every((key)=>a[key] === b[key])
    }
    return a === b
}

class Expectation {
    check
    constructor(name, result) {
        this.name = name;
        this.result = result;
        if (!win.___xest___[win.___name___]) {
            win.___count___ +=1;
            win.___xest___[win.___name___] = this;
        }
    }

    async __get_result__() {
        if (this.result.constructor.name === "Promise") {
            return await this.result
        } else return this.result
    }

    toEqual(y) {
        this.check = async () => {
            return equals(await this.__get_result__(), y);
        }
    }

    toNotEqual(y) {
        this.check = async () =>{
            return !equals(await this.__get_result__(), y);
        }
    }
}

function expect(x) {
    return new Expectation(win.___name___, x)
}

win.test = function test(name = '', func = () => {}) {
    win.___name___ = name;
    func()
    // window.___xests___[name] = func.toString()
}

String.prototype.expect = function (x=true) {
    win.___name___ = this;
    return new Expectation(this, x);
}

function run() {
    console.warn(`%cRunning ${win.___count___} Tests `, "font-weight: bold")
    let keys = Object.keys(win.___xest___);
    for (let idx = 0; idx < keys.length; idx++){
        if (win.___done___.indexOf(idx)>=0) {
            continue;
        }
        let name = keys[idx];
        const x = win.___xest___[name];
        setTimeout(async ()=>{
            let res = await x.check();
            let cls = res?'succeeded!':'failed';
            if (res) {
                win.___done___.push(idx);
                console.log(`%c[${idx+1}/${keys.length}] ${name} ${cls}`,"font-weight: bold; color: green")
            } else {
                console.error(`%c[${idx+1}/${keys.length}] ${name} ${cls}`,"font-weight: bold;")
            }
            if (idx+1 === win.___count___) console.warn(`%cDone ${win.___done___.length} of ${win.___count___} successful!`, 'font-weight: bold')
        },0);
    }
}

// module.exports = {run}