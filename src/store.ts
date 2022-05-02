import {isFunc,proxify} from './lib';

export interface StorxyStore<T>{
  /** Store's value */
  $: T;
  /** Subscription to the store's updates */
  subscribe: SubscribeFn<T>;
  /** Subscription to the store's updates (alias for subscribe) */
  $$: SubscribeFn<T>;
}

/** Subscribe for store's updates
 * @param callback callback which will be called each time when store's value changes
 * @param preventRunOnSubscribe if true, will not run callback on subscription with current value, only when value will be changed
*/
export type SubscribeFn<T> = (callback:SubscribeCallback<T>, preventRunOnSubscribe:boolean)=>UnsubscribeFn;

/** Call this callback each time store's value changes */
export type SubscribeCallback<T> = (value:T)=>void;

/** Call this function when no more subscribers  */
type LastSubscriberFn<T> = (store:StorxyStore<T>)=>void;

/** Call this function when store gets first subscriber */
type FirstSubscriberFn<T> = (store:StorxyStore<T>)=>LastSubscriberFnOrVoid<T>;
type LastSubscriberFnOrVoid<T> = void | LastSubscriberFn<T> | Promise<LastSubscriberFn<T>>;

/** Function to cancel store subscription  */
export type UnsubscribeFn = ()=>void

/** Create a store
 * @param initial initial store value
 * @param onfirst callbacks for first and last subscribers
 */
export function store<T>( initial?:T, onfirst?:FirstSubscriberFn<T>): StorxyStore<T> {
  let run: ()=>void;
  let listeners = new Set< SubscribeCallback<T> >();
  let onlast: LastSubscriberFnOrVoid<T>;

  const storxy = proxify({
    $: initial
  },() => run(), '$' ) as StorxyStore<T>;

  run = () => {
    listeners.forEach( fn => fn(storxy.$) );
  };

  storxy.subscribe = (fn, prevent) => {

    // Run onFirst callback
    if(onfirst && !listeners.size && isFunc(onfirst)) onlast = onfirst(storxy);

    listeners.add(fn);
    if(!prevent) fn(storxy.$); // Run callback on subscription, if not prevented

    // Return unsubscribe function
    return (() => {
      listeners.delete(fn);

      // Run callback when no more listeners
      if(onlast && !listeners.size){
        if(isFunc(onlast))
          (onlast as LastSubscriberFn<T>)(storxy);
        else if(isFunc((onlast as Promise<LastSubscriberFn<T>>).then))
          (onlast as Promise<LastSubscriberFn<T>>).then(fn => fn(storxy));
      }
    }) as UnsubscribeFn;
  };

  storxy.$$ = storxy.subscribe;

  return storxy;
}