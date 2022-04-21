import {store} from './store';

export function computed(deps,fn){
    let run;

    if(!deps || (!deps.length && !deps.subscribe)) return store();
   
    const derived = store(undefined,()=>{
        let unsubscribers = (deps.length ? deps : [deps]).map(d => d.subscribe(v=>run(v),true));
        
        return ()=>{
            unsubscribers.forEach(un => un());
        }
    });

    run = ()=>{
        derived.$ = fn(deps.length ? deps.map( d => d.$) : deps.$);
    }
    run();

    return derived;    
}