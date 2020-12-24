const {renderView} = require("../view");
const {createView} = require("../view");

const BasicRouter = createView({
    state: {
        root: '/',
        currentPath: '/',
        currentRoute: undefined
    },
    render() {
        global.$router = this
        return this.state.currentRoute
    },
    beforeCreate() {
        this.state.root = this.props.root || '/';
        this.$name = 'BasicRouter-'+this.state.root;
    },
    route(path = '/') {
        if (path === this.state.currentPath) {
            return true;
        }
        let root = this.state.root;
        let loc = path.indexOf(root);
        if (loc===0 || (path[0] === '/' && loc === 1)) {
            let part = path.slice(loc+root.length);
            let route = this.$children.find(c=>{
                if (!c.props) return false;
                let loc2 = part.indexOf(c.props.path);
                if (loc2===0 || (part[0] === '/' && loc2 === 1)) return true
            });
            this.state.currentPath = path;
            this.state.currentRoute = route?renderView(route, route.props, route.$children):undefined;
            this.$update();
            return !!route;
        }
        return false;
    }
})

const Route = createView({
    beforeCreate() {
        this.$name = 'Route>'+this.props.path || '*';
    },
    render() {
        return this.$children
    },
    // Created() {
    //     console.log('Created',this.$name,)
    // },
    shouldUpdate({oldProps, newProps}) {
        if (oldProps.path === newProps.path) return false;
    },
    // beforeUpdate() {
    //     console.log('beforeUpdate',this.$name,)
    // },
    // Updated() {
    //     console.log('Updated',this.$name,)
    // },
    // beforeMount() {
    //     console.warn('beforeMount',this.$name,)
    // },
    // Mounted() {
    //     console.warn('Mounted',this.$name,)
    // }
})

module.exports = {BasicRouter, Route}