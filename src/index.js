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
        if(onlast && !listeners.size && isFunc(onlast)) onlast();
    }

    storxy.subscribe = fn => {
        if(!listeners.size) onlast = isFunc(onfirst) ? onfirst() : null;
        listeners.add(fn);
        fn(storxy.$);
        return () => unsubscribe(fn);
    }

    storxy.$$ = storxy.subscribe;
    
    return storxy;
}