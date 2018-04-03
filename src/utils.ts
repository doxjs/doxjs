export const defineProperty = Object.defineProperty;
export const getKeys = Object.keys || function(obj: object) {
    let keys: string[] = [];
    for (let key in obj) {
        keys.push(key);
    }
    return keys;
}

export const _toString = Object.prototype.toString;
export const isObject = function(target) {
    return _toString.call(target) === '[object Object]';
}
export const isPrimary = function(target) {
    //don't support `Map` `WeakMap` `Set`
    let priTypes = ['[object Number]', '[object String]', '[object Boolean]', '[Object Symbol]'];
    return priTypes.indexOf(_toString.call(target)) > -1;
}
export const isArray = Array.isArray || function(target) {
    return _toString.call(target) === '[object Array]';
}

export const isFunction = function(f) {
    return (f instanceof Function || typeof f === 'function' || _toString.call(f) === '[object Function]');
}

export const hasProperty = function(src, key) {
    if (Object.hasOwnProperty) {
        return Object.hasOwnProperty.call(src, key);
    } else {
        return (key in src);
    }
}

export const warn = (message: string) => {
    throw new Error(message);
}

export const isUndefined = (un) => {
    return _toString.call(un) === '[object Undefined]' || un === undefined;
}

export const isNull = (nu) => {
    return _toString.call(nu) === '[object Null]' || nu === null;
}


export const isSame = function(source, target): boolean {

    if (isPrimary(source)) {
        return isPrimary(target) ? source === target : false;
    } else if (isArray(source)) {
        if (!isArray(target)) {
            return false;
        }

        if (source.length !== target.length) {
            return false;
        }

        return source.every((item, index) => {
            return isSame(item, target[index]);
        });
    } else if (isObject(source)) {
        if (!isObject(target)) {
            return false;
        }

        let src_keys = getKeys(source),
            tar_keys = getKeys(target);

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

    } else if (isUndefined(source)) {
        return isUndefined(target);
    } else if (isNull(source)) {
        return isNull(target);
    }

    return false;
}
