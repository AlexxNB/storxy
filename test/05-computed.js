const {store,computed} = require('./..');

console.log('> Creating first store');
const firstStore = store(10);

console.log('> Creating second store');
const secondStore = store(5);

console.log('> Creating computed store with one dependency');
const doubleStore = computed(firstStore, value => {
    return value * 2;
});

console.log('> Creating computed store with list of dependencies');
const multipleStore = computed([firstStore,secondStore], ([value1,value2]) => {
    return value1 * value2;
});

console.log('> Subscribe for doubleStore');
doubleStore.$$($ => console.log('Double:',$));

console.log('> Subscribe for multipleStore');
multipleStore.$$($ => console.log('Multiple:',$));

console.log('> Change value of firstStore');
firstStore.$ += secondStore.$;

console.log('> Change value of secondStore');
secondStore.$ = 25;