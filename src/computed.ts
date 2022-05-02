import {store} from './store';
import type {StorxyStore, SubscribeFn,UnsubscribeFn} from './store';

/** Store or array of stores */
type Stores = StorxyStore<any> | StorxyStore<any>[];

/** Value of store or array of value of stores */
type StoresValues<T> = T extends StorxyStore<infer U> ? U : {
    [K in keyof T]: T[K] extends StorxyStore<infer U> ? U : never 
};

/** Makes computed store where value depends on other stores values
 * @param stores store or array of stores, which will be watched for changes
 * @param fn callback which gets all watching stores values and return value for computed store
 */
export function computed<S extends Stores,T>(
    stores: S, 
    fn:(values:StoresValues<S>)=>T
): StorxyStore<T> {

    const isArray = Array.isArray(stores);

    if(!stores || !(isArray || "subscribe" in stores)) return store();
    
    const derived = store<T>(undefined, st => {

        function run(){
            st.$ = fn(isArray ? stores.map( depSt => depSt.$): stores.$);
        }

        let unsubscribers: UnsubscribeFn[] = (isArray ? stores : [stores]).map(depSt => depSt.subscribe(run,true));
        
        run();
        return ()=>unsubscribers.forEach(un => un());
    });

    return derived;    
}