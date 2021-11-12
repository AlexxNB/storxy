export function computed(deps,fn){
    let run;
    let unsubscribers = [];   

    if(!deps || (!deps.length && !deps.subscribe)) return store();

    const derived = store(undefined,()=>{
        unsubscribers.push((deps.length ? deps : [deps]).forEach( d => d.subscribe(run,true)));
        return ()=>{
            unsubscribers.forEach(un => un());
            unsubscribers = [];
        }
    });

    run = ()=>{
        derived.$ = fn(deps.length ? deps.map( d => d.$) : deps.$);
    }
    run();

    return derived;    
}