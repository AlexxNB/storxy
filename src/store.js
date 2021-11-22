import {isFunc,proxify,deproxify} from './lib';

export function store(initial,onfirst){
    let run;
    let listeners = new Set();
    let onlast = null;

    const storxy = proxify({
        $: initial
    },() => run(), '$' );

    run = () => {
        const target = deproxify(storxy.$);
        listeners.forEach( fn => fn(target) );
    }

    const unsubscribe = fn => {
        listeners.delete(fn);
        if(onlast && !listeners.size && isFunc(onlast)) onlast(storxy);
    }

    storxy.subscribe = (fn, prevent) => {
        if(!listeners.size) onlast = isFunc(onfirst) ? onfirst(storxy) : null;
        listeners.add(fn);
        if(!prevent) fn(deproxify(storxy.$));
        return () => unsubscribe(fn);
    }

    storxy.$$ = storxy.subscribe;
    
    return storxy;
}