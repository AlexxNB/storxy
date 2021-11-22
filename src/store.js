import {isFunc,proxify} from './lib';

export function store(initial,onfirst){
    let run;
    let listeners = new Set();
    let onlast = null;

    const storxy = proxify({
        $: initial
    },() => run(), '$' );

    run = () => {
        listeners.forEach( fn => fn(storxy.$) );
    }

    const unsubscribe = fn => {
        listeners.delete(fn);
        if(onlast && !listeners.size && isFunc(onlast)) onlast(storxy);
    }

    storxy.subscribe = (fn, prevent) => {
        if(!listeners.size) onlast = isFunc(onfirst) ? onfirst(storxy) : null;
        listeners.add(fn);
        if(!prevent) fn(storxy.$);
        return () => unsubscribe(fn);
    }

    storxy.$$ = storxy.subscribe;
    
    return storxy;
}