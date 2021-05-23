# storxy

Stupid simple state manager based on proxies

## Inspiration

This state manager provides a store which was inspired by `writable` store from Svelte and `reactive()` function from Vue3. Store has `$` property, which you can read and write. When you change the value of this property, all subscribers will get updated state value.

## Usage

```js
import {store} from 'storxy';

// Create a store with initial state value 'Hello'
const myStore = store('Hello');

// Subscribe for updates
const un = myStore.subscribe( value => console.log('Subscriber:',value));

// Change state value
myStore.$ = myStore.$.toUpperCase();

// Now in console you will see 'Subscriber: HELLO'

// Unsubscribe
un();

```
## Subscriptions

Store's instance provides `subscribe` method where you should pass a callback-function which will get current store's state value. This function will be called each time state changes. Also there is short alias for this method `$$`. You may add any number of subscribers.

The `subscribe` method (and `$$`) returns function which you may call when need to cancel subscription.


## Custom stores

By default store is very simple, but you may implement any additional methods to handle business logic in the store:

```js

import {store} from 'storxy';

// Create a store
const myStore = store(0);
myStore.increment = ()=>myStore.$++;
myStore.decrement = ()=>myStore.$--;
...
// Subscribe for updates
myStore.subscribe(value => console.log('Count:',value));

// Use your custom methods
myStore.increment(); // 1
myStore.increment(); // 2
myStore.decrement(); // 1

```
> Don't rewrite `subscribe`,`$$` and `$` methods – store will be broken in this case.


## First and last subscribers

There a two hooks which will be run when first subscriber will be registered and when all subscribers will be removed.

```js
import {store} from 'storxy';

// Create a store with callback in second argument
const myStore = store(0,()=>{
    console.log("I will run when number of subscribers will change from 0 to 1");
    return ()=>console.log("I will run when number of subscribers will change from 1 to 0");
});

```