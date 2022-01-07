export function isObject(a) {return a !== null && typeof a === 'object'}

export function isFunc(a) {return typeof a === 'function'}

export function not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && isObject(a)) || isFunc(a));
}

export function proxify(obj,fn,only){
    if(!isObject(obj)) return obj;
    
    for(let prop in obj){
        obj[prop] = proxify(obj[prop],fn);
    }
    
    const proxy = new Proxy(obj,{
        set(target,prop,value){       
            if(!not_equal(target[prop],value)) return true;
            target[prop] = proxify(value,fn);
            if(!only || prop === only) fn();
            return true;
        }
    });
    return proxy;
}

export function loop(fn){
    let id = null;
    let start = null;
    let stopped = false;

    const step = ()=>{id = window.requestAnimationFrame(callback)};
    const stop = ()=>{
        stopped=true;
        window.cancelAnimationFrame(id);
    }

    function callback(now){
        if(!start) start = now;

        fn({
            now,
            start,
            elapsed: now-start,
            stop
        });

        !stopped && step();
    }

    step();
    return{
        stop
    }
}