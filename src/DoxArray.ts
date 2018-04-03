import { RuntimeEvent, DoxArrayProxy, DoxCallback, DoxEventsStore, DoxObjectProxy } from "./DoxInterfaces";
import { defineProperty, getKeys, _toString, isArray, isObject, isPrimary, hasProperty, isSame, isUndefined } from "./utils";
import { DoxObject } from "./DoxObject";
import DoxJS from "./index";
import * as dfa from "./core";

export class DoxArray<T> {

    private runtimeEvent: RuntimeEvent<any> = {
        isLegal: false,
        value: (store) => {}
    };
    private eventsStore: DoxEventsStore<any> = {};
    private dataToProxy: T[] = [];
    private target: T[];
    private proxy: DoxArrayProxy<T> = {
        length: 0
    };
    private root: DoxJS<any>;
    private keys: string[];
    private delicate: boolean = true;
    private definedProperties: string[] = [];

    constructor(target: T[], root: DoxJS<any>) {
        this.target = target;
        this.root = root;
        this.keys = getKeys(target);
        this.init();
    }

    private init() {
        let fn = () => {
            this.keys.forEach(key => {     
                if (this.definedProperties.indexOf(key) > -1) {
                    return;
                }
                this.definedProperties.push(key);
                this.eventsStore[key] = this.eventsStore[key] || [];

                defineProperty(this.proxy, key, {
                    configurable: true,
                    enumerable: true,
                    get: () => {
                        if (this.runtimeEvent.isLegal) {
                            this.eventsStore[key].forEach((f, i, a) => {
                                if (f === this.runtimeEvent.value) {
                                    this.eventsStore[key].splice(i, 1);
                                }
                            });
                            this.eventsStore[key].push(this.runtimeEvent.value);
                        }
    
                        if ((this.dataToProxy[key] instanceof DoxObject) || (this.dataToProxy[key] instanceof DoxArray)) {
                            if (this.runtimeEvent.isLegal) {
                                this.dataToProxy[key].extendsRuntimeEvent(this.runtimeEvent);
                            }
                            return this.dataToProxy[key].observe();
                        } else if (isPrimary(this.dataToProxy[key])) {
                            return this.dataToProxy[key];
                        }
                    },
    
                    set: (newValue) => {
                       // console.log(newValue, this.dataToProxy[key]);
                        let target = this.dataToProxy[key];
                        if (target instanceof DoxObject || target instanceof DoxArray) {
                            target = target.observe();
                        }
                        if (!isSame(newValue, target)) {
                            if (isPrimary(newValue)) {
                                this.dataToProxy[key] = newValue;
                            } else if (isObject(newValue)) {
                                this.dataToProxy[key] = new DoxObject(newValue, this.root);
                            } else if (isArray(newValue)) {
                                this.dataToProxy[key] = new DoxArray(newValue, this.root);
                            }
                        }
                        if (this.delicate) {
                            this.eventsStore[key].forEach(f => f(this.root.observe()));
                            this.root.execLonely();
                        }
                    }
                });

                //  don't use ||, cause this.proxy[key] could be Number 0, and Number 0 is falsy 
                if (isUndefined(this.dataToProxy[key])) {
                    this.proxy[key] = this.target[key];
                } else {
                    let target = this.dataToProxy[key];
                    if (target instanceof DoxObject || target instanceof DoxArray) {
                        this.proxy[key] = target.observe();
                    } else {
                        this.proxy[key] = target;
                    }
                }
            });
        }

        fn();


        defineProperty(this.proxy, "length", {
            enumerable: false,
            configurable: false,
            writable: true,
            value: this.target.length
        });

        dfa.methods.forEach(method => {
            defineProperty(this.proxy, method, {
                configurable: false,
                writable: false,
                enumerable: false,
                value: (...args) => {

                    // these method will change array self
                    if (['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].indexOf(method) > -1) {          
                        this.toggleDelicate(false);
                        // rebuild the array                 
                        let result = dfa[method].call(this.dataToProxy, ...args);                
                        this.processArray(this.proxy, this.dataToProxy.length);
                        this.keys = getKeys(this.dataToProxy);
                        fn();
                        this.runNREvents();
                        this.root.execLonely();
    
                        this.toggleDelicate();
                        return result;
                    } else {
                        return dfa[method].call(this.proxy, ...args);
                    }
                }
            });
        });



        // for...of
        this.proxy[Symbol.iterator] = () => {
            let index = 0,
                length = this.proxy.length;
            return {
                next: () => {
                    return {
                        value: this.proxy[index],
                        done: index++ === length
                    }
                }
            }
        }
        
    }

    private toggleDelicate(is: boolean = true) {
        this.delicate = is;
    }

    public extendsRuntimeEvent(callback: RuntimeEvent<T>) {
        this.runtimeEvent = callback;    
    }

    public observe(): DoxArrayProxy<T> {
        return this.proxy;
    }

    private processArray(arrLike, length) {
        if (arrLike.length < length) {
            for (let i = arrLike.length; i < length; i++) {
                delete arrLike[i];
            }
        } else {
            for (let i = length; i < arrLike.length; i++) {  
                delete arrLike[i];
            }
        }

        arrLike.length = length;
    }

    // run non-repeating events
    private runNREvents() {
        let stack = [];
        for (let key in this.eventsStore) {
            let events = this.eventsStore[key];
            
            for (let i = 0; i < events.length; i++) {
                stack = stack.reduce((prev, current, index) => {
                    if (current != prev[0]) {
                        prev.push(current);
                    }
                    return prev;
                }, [events[i]]);
            }
        }

        stack.forEach(f => {
            f(this.root.observe());
        });
    }
}
