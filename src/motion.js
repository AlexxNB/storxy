import {store} from './store';
import {loop,proxify} from './lib';

export function motion(initial,options){
    options = Object.assign({
        duration: 300,
        easing: easeInOutCubic,
        interpolate
    },options);

    const st = store(initial);

    let running = null;
    const startMotion = (to) => {
        running && running.stop();
        const valueFn = options.interpolate(st.$,to);
        
        running = loop(step =>{
            const position = step.elapsed / options.duration || 0;
            if(position >= 1) return (step.stop(), st.$ = to);
            st.$ = valueFn(options.easing(position));
        });
    }

    return {
        subscribe: st.subscribe,
        get $(){return st.$},
        set $(value){
            startMotion(value);
        }
    }
}

function interpolate (from,to){
    return function(t){
        return from + (to-from)*t;
    };
}

function easeInOutCubic(x){
    return x < 0.5 ? 4 * Math.pow(x,3) : 1 - Math.pow(-2 * x + 2, 3) / 2;
}