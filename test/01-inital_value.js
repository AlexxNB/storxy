const {store} = require('./..');

console.log('> Creating store');
const testStore = store('Hello');

console.log('> Check initial value');
console.log(testStore.$);