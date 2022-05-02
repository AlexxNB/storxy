const {store} = require('./..');

console.log('> Creating store');

const testStore = store(0, store => {
  console.log("I'm run on first subscriber");
  store.$ = 5;
  return () => console.log("I'm run when no subscribers left");
});

console.log('> First subscriber');
const un1 = testStore.subscribe( $ => console.log('Subscriber1:', $));

console.log('> Change store value');
testStore.$++;

console.log('> Second subscriber');
const un2 = testStore.subscribe( $ => console.log('Subscriber2:', $));

console.log('> Change store value');
testStore.$ = 10;

console.log('> Destroy first subscriber');
un1();

console.log('> Change store value');
testStore.$ += 10;

console.log('> Destroy second subscriber');
un2();