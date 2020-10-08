const {Core} = require("../dist/node");
console.log('ALL', Core.filter(Core,(v,k)=>k.startsWith('f')))