/* 2.1 */

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
     const m = new Map();
     return {
         get(key: K) {
             return new Promise<V>((resolve, reject) => 
                                    (m.has(key) ? resolve(m.get(key)) : reject(MISSING_KEY))
             )
         },
         set(key: K, value: V) {
             return new Promise<void>((resolve, reject) => 
                                     (m.set(key, value).has(key) ? resolve() : reject(MISSING_KEY))
             )
         },
         delete(key: K) {
             return new Promise<void>((resolve, reject) => 
                                     (m.delete(key) ? resolve() : reject(MISSING_KEY))
             )
         },
     }
}



export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    return Promise.all(keys.map(key => store.get(key)));
}
     


/* 2.2 */

// ??? (you may want to add helper functions here)

export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
     const store = makePromisedStore<T, R>();
     return async (param: T): Promise<R> => {
        try{
            const l: R = await store.get(param);
            return l;
        }
        catch{
            const val: R = f(param);
            await store.set(param, val);
            return val;
        }
        
     }

}

/* 2.3 */

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (pred: T) => boolean): () => Generator<T> {
    return function*() {
        const gen = genFn();
        for(const k of gen)
            if(filterFn(k))
                yield k;
    }
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (x: T) => R): () => Generator<R> {
     return function*() {
        const gen = genFn();
        for(const k of gen)
           yield mapFn(k);
    };
}

/* 2.4 */
// you can use 'any' in this question

export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...((a: any) => Promise<any>)[]]): Promise<any> {
    let l: any = undefined;
    for(let i = 0; i < fns.length; i++){
        for(let j = 0; j < 3; j++){
            try{
                l = await fns[i](l);
                break;
            }
            catch(e){
                if(j == 2){
                    return e
                }
                else
                    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
            }
        }
    }
    return l;
}