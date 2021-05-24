# storxy

Stupid simple state manager based on proxies. It is very tiny, just 500 bytes of none zipped code, but looks like a magic.

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
myStore.increment(); // Count: 1
myStore.increment(); // Count: 2
myStore.decrement(); // Count: 1

```
> Don't rewrite `subscribe`,`$$` and `$` methods – store will be broken in this case.


## First and last subscribers

There a two hooks which will be run when first subscriber will be registered and when all subscribers will be removed.

```js
import {store} from 'storxy';

// Create a store with callback in second argument
const myStore = store(0,()=>{
    console.log("I will run before number of subscribers will change from 0 to 1");
    return ()=>console.log("I will run after number of subscribers will change from 1 to 0");
});
```

## Computed stores

You can create a computed store which will use a value of other store and will be updated each time its value be updated.

```js
import {store,computed} from 'storxy';

const number1 = store(5);
const number2 = store(10);

const doubleFirst = computed(number1, value => value*2);

const multipleBoth = computed([number1,number2], ([value1,value2])=>{
  return value1*value2;
});
```

It has same `API` as a `store`. So you can `subscribe` for updates and get current store value from `$` property.

## Using with frameworks

Let's create a simple custom store which we can use in any framework:

```js
// stores.js
import {store} from 'storxy';

export const counter = store(0);
counter.increment = () => counter.$++;
counter.decrement = () => counter.$--;
```

### Svelte

Just use as internal Svelte's store or any Observable-like object, to get a value of the store. But set and update store's value using `storxy` API:

```html
<!-- App.svelte -->
<script>
    import {counter} from './stores.js';
</script>

<h1>Count: {$counter}</h1>

<button on:click={counter.increment}>+</button>
<button on:click={counter.decrement}>-</button>
<button on:click={() => counter.$ = 0}>Reset</button>
```
> See live example [here](https://svelte.dev/repl/81ebb80c70f346fdb348be6472280e60)

### Malina.js

The Malina framework works smoothly with `storxy` API:

```html
<!-- App.xht -->
<script>
    import {counter} from './stores.js';
</script>

<h1>Count: {counter.$}</h1>

<button on:click={counter.increment}>+</button>
<button on:click={counter.decrement}>-</button>
<button on:click={() => counter.$ = 0}>Reset</button>
```
> See live example [here](https://malinajs.github.io/repl/#/share/60ab502ca59a5a00156e4e06)

## Vue

You should manually handle subscription. To change store's value just use `store.$`.

```html
<template>
  <div>
    <h1>Count: {{ count }}</h1>

    <button @click="increment()">+</button>
    <button @click="decrement()">-</button>

    <button @click="reset()">Reset</button>
  </div>
</template>

<script>
import { counter } from "./stores.js";

export default {
  name: "App",

  data() {
    return {
      count: counter.$,
    }
  },

  created() {
    this.un = counter.$$( $ => this.count = );
  },

  beforeDestroy() {
    this.un();
  },

  methods: {
    increment: counter.increment,
    decrement: counter.decrement,
    reset() {
      counter.$ = 0;
    }
  }
}
</script>
```
> See live example [here](https://codesandbox.io/s/storxy-example-hyubg)

Also you may use Vue's object watcher with `storxy`, but in this case component will not subscribe for store changes. In this case _on-first_ and _on-last_ hooks will not be called when component will be rendered. 

```html
<template>
  <div>
    <h1>Count: {{ counter.$ }}</h1>

    <button @click="counter.increment()">+</button>
    <button @click="counter.decrement()">-</button>

    <button @click="reset()">Reset</button>
  </div>
</template>

<script>
import { counter } from "./stores.js";

export default {
  name: "App",

  data() {
    return {
      counter
    }
  },

  methods: {
    reset() {
      counter.$ = 0;
    }
  }
}
</script>
```
