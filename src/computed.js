import {store} from './store';

export function computed(deps,fn){
    if(!deps || (!deps.length && !deps.subscribe)) return store();
   
    const derived = store(undefined, st => {

        function run(){
            st.$ = fn(deps.length ? deps.map( d => d.$) : deps.$);
        }

        let unsubscribers = (deps.length ? deps : [deps]).map(d => d.subscribe(run,true));
        
        run();
        return ()=>unsubscribers.forEach(un => un());
    });

    return derived;    
}