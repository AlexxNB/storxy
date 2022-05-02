import {store, type StorxyStore} from './store';
import {loop, type StopLoopFn} from './lib';

/** Motion settings */
interface MotionOptions<T> {
    /** Time in microseconds when store value will reach target value */
    duration: number;
    easing: EasingFn;
    interpolate: InterpolateFn<T>;
}

/** Function which makes intermedial values when x changes from 0 to 1 
 * @param start start value
 * @param end end value
 * @param x number from 0 to 1
 * @returns indermedial value between start and end according current x value
*/
export type InterpolateFn<T> = (start:T,end:T)=>(x:number)=>T;

/** Easing function.
 * @param x value from 0 to 1
 * @returns value from 0 to 1
 * @default easeInOutCubic
 * @see https://easings.net
*/
export type EasingFn = (x:number)=>number;

/** Simple number interpolation function */
const interpolate:InterpolateFn<number> = function(start,end){
    return function(t){
        return start + (end-start)*t;
    };
}

/** easeInOutCubic easing function */
const easeInOutCubic:EasingFn = function(x){
    return x < 0.5 ? 4 * Math.pow(x,3) : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Create a motion store
 * @param initial initial value
 * @param options object with motion settings
 */
export function motion<T>(initial: T, options:Partial< MotionOptions<T> > = {}):StorxyStore<T>{
    const opts = {
        duration: 300,
        easing: easeInOutCubic,
        interpolate,
        ...options
    } as MotionOptions<T>;

    const st = store(initial);

    let stopRunning:StopLoopFn;
    const startMotion = (to:T) => {
        stopRunning && stopRunning();
        const valueFn = opts.interpolate(st.$,to);
        
        stopRunning = loop(step =>{
            const position = step.elapsed / opts.duration || 0;
            if(position >= 1) return (step.stop(), st.$ = to);
            st.$ = valueFn(opts.easing(position));
        });
    }

    return {
        $$: st.$$,
        subscribe: st.$$,
        get $(){
            return st.$
        },
        set $(value){
            startMotion(value);
        }
    } as StorxyStore<T>
}

