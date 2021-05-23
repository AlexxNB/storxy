const {store} = require('./../dist/storxy');

console.log('> Creating store');
const testStore = store('Hello');

console.log('> Subscribe with `subscribe`');
const un = testStore.subscribe( $ => console.log('Subscriber:',$) );

console.log('> Change store value`');
testStore.$ += ' World!';

console.log('> Unsubscribe');
un();

console.log('> Subscribe with `$$`');
const un2 = testStore.$$( $ => console.log('Subscriber$$:',$) );

console.log('> Change store value`');
testStore.$ = testStore.$.toUpperCase();

console.log('> Unsubscribe');
un2();