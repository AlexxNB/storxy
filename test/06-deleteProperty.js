const {store} = require('./..');

console.log('> Creating store');
const testStore = store({a:1,b:2,c:{x:9,y:8}});

console.log('> Subscribe for store');
testStore.$$($ => console.log('Content:',$));

console.log('> Delete property');
delete testStore.$.b;

console.log('> Delete property in nest level');
delete testStore.$.c.x;