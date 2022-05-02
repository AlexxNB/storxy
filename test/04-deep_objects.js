const {store} = require('./..');

console.log('> Creating store with {}');
const testStore = store({});

console.log('> Add a subscriber');
testStore.$$( $ => console.log('Subscriber:', $));

console.log('> Add property a:0');
testStore.$.a = 0;

console.log('> Change property a:1');
testStore.$.a++;

console.log('> Add property b:{foo:"bar"}');
testStore.$.b = {foo:"bar"};

console.log('> Change property b.foo:BAR');
testStore.$.b.foo = testStore.$.b.foo.toUpperCase();

console.log('> Add property b.foo.arr:[1,2,3]}');
testStore.$.b.arr = [1,2,3];

console.log('> Change property b.foo.arr:[1,2,3,4]}');
testStore.$.b.arr.push(4);