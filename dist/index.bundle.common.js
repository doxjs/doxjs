/* DoxJS version 3.2.0           */
/* Created by Double Dimos       */
/* Released under MIT license    */
'use strict';

const defineProperty = Object.defineProperty;
const getKeys = Object.keys || function (obj) {
    let keys = [];
    for (let key in obj) {
        keys.push(key);
    }
    return keys;
};
const _toString = Object.prototype.toString;
const isObject = function (target) {
    return _toString.call(target) === '[object Object]';
};
const isPrimary = function (target) {
    //don't support `Map` `WeakMap` `Set`
    let priTypes = ['[object Number]', '[object String]', '[object Boolean]', '[Object Symbol]'];
    return priTypes.indexOf(_toString.call(target)) > -1;
};
const isArray = Array.isArray || function (target) {
    return _toString.call(target) === '[object Array]';
};
const isFunction = function (f) {
    return (f instanceof Function || typeof f === 'function' || _toString.call(f) === '[object Function]');
};
const hasProperty = function (src, key) {
    if (Object.hasOwnProperty) {
        return Object.hasOwnProperty.call(src, key);
    }
    else {
        return (key in src);
    }
};
const warn = (message) => {
    throw new Error(message);
};
const isUndefined = (un) => {
    return _toString.call(un) === '[object Undefined]' || un === undefined;
};
const isNull = (nu) => {
    return _toString.call(nu) === '[object Null]' || nu === null;
};
const isSame = function (source, target) {
    if (isPrimary(source)) {
        return isPrimary(target) ? source === target : false;
    }
    else if (isArray(source)) {
        if (!isArray(target)) {
            return false;
        }
        if (source.length !== target.length) {
            return false;
        }
        return source.every((item, index) => {
            return isSame(item, target[index]);
        });
    }
    else if (isObject(source)) {
        if (!isObject(target)) {
            return false;
        }
        let src_keys = getKeys(source), tar_keys = getKeys(target);
        if (src_keys.length !== tar_keys.length) {
            return false;
        }
        src_keys.sort();
        tar_keys.sort();
        if (!src_keys.every((item, index) => {
            return item === tar_keys[index];
        })) {
            return false;
        }
        return src_keys.every(item => {
            return isSame(source[item], target[item]);
        });
    }
    else if (isUndefined(source)) {
        return isUndefined(target);
    }
    else if (isNull(source)) {
        return isNull(target);
    }
    return false;
};

function push(...items) {
    return Array.prototype.push.call(this, ...items);
}
function pop() {
    return Array.prototype.pop.call(this);
}
function shift() {
    return Array.prototype.shift.call(this);
}
function unshift(...items) {
    return Array.prototype.unshift.call(this, ...items);
}
function splice(start = 0, deleteCount = 0, ...append) {
    return Array.prototype.splice.call(this, start, deleteCount, ...append);
}
function reverse() {
    return Array.prototype.reverse.call(this);
}
function sort(compareFn) {
    return Array.prototype.sort.call(this, compareFn);
}
function map(callbackfn) {
    return Array.prototype.map.call(this, callbackfn);
}
function forEach(callbackfn) {
    //console.log(this);
    return Array.prototype.forEach.call(this, callbackfn);
}
function every(callbackfn) {
    return Array.prototype.every.call(this, callbackfn);
}
function some(callbackfn) {
    return Array.prototype.some.call(this, callbackfn);
}
function filter(callbackfn) {
    return Array.prototype.filter.call(this, callbackfn);
}
function reduce(callbackfn, initialValue) {
    return Array.prototype.reduce.call(this, callbackfn, initialValue);
}
function concat(...items) {
    items.forEach(item => {
        if (isArray(item)) {
            item.forEach(i => {
                this.push(i);
            });
        }
        else {
            this.push(item);
        }
    });
    return this;
}
function join(separator) {
    return Array.prototype.join.call(this, separator);
}
const methods = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort", "map", "forEach", "every", "some", "filter", "reduce", "concat", "join"];


var dfa = Object.freeze({
	push: push,
	pop: pop,
	shift: shift,
	unshift: unshift,
	splice: splice,
	reverse: reverse,
	sort: sort,
	map: map,
	forEach: forEach,
	every: every,
	some: some,
	filter: filter,
	reduce: reduce,
	concat: concat,
	join: join,
	methods: methods
});

class DoxArray {
    constructor(target, root) {
        this.runtimeEvent = {
            isLegal: false,
            value: (store) => { }
        };
        this.eventsStore = {};
        this.dataToProxy = [];
        this.proxy = {
            length: 0
        };
        this.delicate = true;
        this.definedProperties = [];
        this.target = target;
        this.root = root;
        this.keys = getKeys(target);
        this.init();
    }
    init() {
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
                        }
                        else if (isPrimary(this.dataToProxy[key])) {
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
                            }
                            else if (isObject(newValue)) {
                                this.dataToProxy[key] = new DoxObject(newValue, this.root);
                            }
                            else if (isArray(newValue)) {
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
                }
                else {
                    let target = this.dataToProxy[key];
                    if (target instanceof DoxObject || target instanceof DoxArray) {
                        this.proxy[key] = target.observe();
                    }
                    else {
                        this.proxy[key] = target;
                    }
                }
            });
        };
        fn();
        defineProperty(this.proxy, "length", {
            enumerable: false,
            configurable: false,
            writable: true,
            value: this.target.length
        });
        methods.forEach(method => {
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
                    }
                    else {
                        return dfa[method].call(this.proxy, ...args);
                    }
                }
            });
        });
        // for...of
        this.proxy[Symbol.iterator] = () => {
            let index = 0, length = this.proxy.length;
            return {
                next: () => {
                    return {
                        value: this.proxy[index],
                        done: index++ === length
                    };
                }
            };
        };
    }
    toggleDelicate(is = true) {
        this.delicate = is;
    }
    extendsRuntimeEvent(callback) {
        this.runtimeEvent = callback;
    }
    observe() {
        return this.proxy;
    }
    processArray(arrLike, length) {
        if (arrLike.length < length) {
            for (let i = arrLike.length; i < length; i++) {
                delete arrLike[i];
            }
        }
        else {
            for (let i = length; i < arrLike.length; i++) {
                delete arrLike[i];
            }
        }
        arrLike.length = length;
    }
    // run non-repeating events
    runNREvents() {
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

class DoxObject {
    constructor(target, root) {
        this.keys = [];
        this.runtimeEvent = {
            isLegal: false,
            value: (store) => { }
        };
        this.eventsStore = {};
        this.dataToProxy = {};
        this.proxy = {};
        this.delicate = false;
        this.target = target;
        this.keys = getKeys(target);
        this.root = root;
        this.init();
    }
    init() {
        this.keys.forEach(key => {
            this.eventsStore[key] = [];
            this.proxy[key] = undefined;
            defineProperty(this.proxy, key, {
                get: () => {
                    this.root._isRelyAnyVar = true;
                    if (this.runtimeEvent.isLegal) {
                        // fix bug, dont change eventStore[key]' memery address, so using splice instead of others
                        this.eventsStore[key].forEach((f, i, a) => {
                            if (f === this.runtimeEvent.value) {
                                a.splice(i, 1);
                            }
                        });
                        this.eventsStore[key].push(this.runtimeEvent.value);
                    }
                    if ((this.dataToProxy[key] instanceof DoxObject) || (this.dataToProxy[key] instanceof DoxArray)) {
                        if (this.runtimeEvent.isLegal) {
                            this.dataToProxy[key].extendsRuntimeEvent(this.runtimeEvent);
                        }
                        return this.dataToProxy[key].observe();
                    }
                    else if (isPrimary(this.dataToProxy[key])) {
                        return this.dataToProxy[key];
                    }
                },
                set: (newValue) => {
                    if (!isSame(this.dataToProxy[key], newValue)) {
                        if (isPrimary(newValue)) {
                            this.dataToProxy[key] = newValue;
                            this.eventsStore[key].forEach(f => f(this.root.observe()));
                        }
                        else if (isObject(newValue)) {
                            this.dataToProxy[key] = new DoxObject(newValue, this.root);
                            this.eventsStore[key].forEach(f => {
                                this.root.subscribe(f);
                            });
                        }
                        else if (isArray(newValue)) {
                            this.dataToProxy[key] = new DoxArray(newValue, this.root /*, this.eventsStore[key]*/);
                            this.eventsStore[key].forEach(f => {
                                this.root.subscribe(f);
                            });
                        }
                        this.root.execLonely();
                    }
                }
            });
            this.proxy[key] = this.target[key];
        });
    }
    extendsRuntimeEvent(callback) {
        this.runtimeEvent = callback;
    }
    observe() {
        return this.proxy;
    }
}

Array.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback.call(this, this[i], i, this);
    }
};
class DoxJS {
    constructor(target) {
        this.loneListeners = [];
        this._isRelyAnyVar = false;
        if (!isObject(target)) {
            warn(`DoxJS only accept object as argument`);
        }
        else {
            this.sourceObject = new DoxObject(target, this);
        }
    }
    execLonely() {
        this.loneListeners.forEach(f => f());
    }
    subscribe(listener, excuteLater = false, context) {
        if (isFunction(listener)) {
            this.runtimeEvent = {
                isLegal: true,
                value: listener
            };
            let fn = () => {
                // check if rely any var
                this._isRelyAnyVar = false;
                this.sourceObject.extendsRuntimeEvent(this.runtimeEvent);
                listener(this.sourceObject.observe());
                this.runtimeEvent.isLegal = false;
                // not rely any var
                if (!this._isRelyAnyVar) {
                    this.loneListeners.push(listener);
                }
                this._isRelyAnyVar = false;
            };
            return (excuteLater ? fn : fn());
        }
        else if (_toString.call(listener) === '[object String]') {
            if (hasProperty(this.listeners, listener)) {
                if (context) {
                    this.subscribe(this.listeners[listener].bind(context), excuteLater);
                }
                else {
                    this.subscribe(this.listeners[listener], excuteLater);
                }
            }
        }
        else {
            warn(`First parameter of subscribe should be Function or String`);
        }
    }
    bindListeners(listeners = {}) {
        this.listeners = listeners;
    }
    observe() {
        return this.sourceObject.observe();
    }
    bindActions(actions = {}) {
        this.actions = actions;
    }
    dispatch(action, ...args) {
        if (hasProperty(this.actions, action)) {
            this.actions[action](this.sourceObject.observe(), ...args);
        }
    }
}

module.exports = DoxJS;
