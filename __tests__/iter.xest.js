// import I from "../core/iter"
//
// const object = {
//     a:{name:'A', age: 12},
//     b:{name:'B', age: 13},
//     c:{name:'C', age: 14},
//     d:{name:'D', age: 15}
// };
// const array = [1,2,3,4];
//
// test('filter array by predicate', () => {
//     // filter array by predicate
//     // even numbers
//     expect(I.Filter([1,2,3,4], (i)=>i%2!==0)).toEqual([1,3]);
// });
//
// test('filter array/object by index/key', () => {
//     // filter array by indices
//     expect(I.Filter([1,2,3,4], [0, 2])).toEqual([1,3]);
//
//     // filter object by keys
//     expect(I.Filter({a:1,b:2,c:3,d:4}, ['a','c'])).toEqual({a:1,c:3});
// });
//
// test('filter object', ()=>{
//     expect(I.Filter(object, {})).toEqual(object);
//     expect(I.Filter(object, {age:13})).toEqual({b: object.b});
//     expect(I.Filter(object, (it)=>it.age>13)).toEqual({c: object.c, d: object.d});
// });
