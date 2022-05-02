export interface CommonObject {
    [key:string]:any
}

/** Tests if the given value of type object */
export function isObject(obj: unknown): obj is CommonObject{
    return obj !== null && typeof obj === 'object'
}

/** Tests if the given value of type function */
export function isFunc(obj: any){
    return typeof obj === 'function'
}

/** Tests if given values are equal. (not deep, objects and funcs always are not equal) */
export function not_equal(a: unknown, b: unknown) {
	return a != a ? b == b : a !== b || ( (!!a && isObject(a)) || isFunc(a) );
}


/** Recursively make proxied object from given object  
 * @param obj object for proxyfying
 * @param fn callback function which will be call every time when object changes
 * @param only name of property in parent object for proxyfing (other will be ignored)
 */
export function proxify(obj: unknown, fn:()=>void, only?:string){
    if(!isObject(obj)) return obj;

    for(let property in obj){
        obj[property] = proxify( obj[property], fn);
    }

    function run(property:string){
        if(!only || property === only) fn();
    }
    
    const proxy = new Proxy(obj,{
        set(target:CommonObject, prop:string, value:unknown){       
            if(!not_equal(target[prop],value)) return true;
            target[prop] = proxify(value,fn);
            run(prop);
            return true;
        },
        deleteProperty(target:CommonObject, prop:string) {
            delete target[prop];
            run(prop);
            return true;
        }
    });
    return proxy;
}

interface CallbackData {
    /** Current timestamp */
    now: number;
    /** Start time */
    start: number;
    /** Elapsed time from start */
    elapsed: number;
    stop: StopLoopFn;
}

/** Stop loop cycle */
export type StopLoopFn = ()=>void;

type LoopCallback = (data:CallbackData)=>void;

/** Run fn each animation frame */
export function loop(fn:LoopCallback){
    let id:number;
    let start:number;
    let stopped:boolean = false;

    const step = ()=>{id = window.requestAnimationFrame(callback)};
    const stop:StopLoopFn = ()=>{
        stopped=true;
        window.cancelAnimationFrame(id);
    }

    function callback(now:number){
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
    return stop;
}