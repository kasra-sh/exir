import Exir from "../../vm/exir";
import List from "./List";
import Empty from "./Empty";
import Child from "./Child";

export default Exir.createComponent('App',{
    state: {
        x: 0
    },
    click(){
        this.state.x++
        this.$isDirty = true
        this.$update()
    },
    render() { return <div>
        <Empty></Empty>
        <h1 onClick={this.click}>Header</h1>
        <div id={'container'}>
            <div>Items Header</div>
        </div>
        <List step={150}>
            {/*<h3 id={this.state.x}>BB</h3>*/}
            {/*<h3 id={this.state.x+1}>UU</h3>*/}
            <Child type={'div'} name={'Child3'}></Child>
            <Child type={'p'} name={'Child1'}></Child>
            <Child type={'b'} name={'Child2'}></Child>
        </List>
        {/*<h3>Footer {Date.now()}</h3>*/}
    </div>}
})