var Eventra;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 568:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Eventra = void 0;
const ListenerArray_1 = __importDefault(__webpack_require__(351));
class Eventra {
    constructor() {
        this._listeners = new ListenerArray_1.default({ mode: "recurring" });
        this._singularListeners = new ListenerArray_1.default({ mode: "once" });
        /**
         * Alias for `Eventra.on`
         */
        this.addListener = this.on;
        /**
         * Alias for `Eventra.removeListener`
         */
        this.off = this.removeListener;
    }
    /**
     * Synchronously calls each of the listeners registered for the event, in the order they were registered, passing the supplied arguments to each.
     */
    emit(event, ...args) {
        this._listeners.executeEvent(event, ...args);
        this._singularListeners.executeEvent(event, ...args);
    }
    /**
     * Returns an array listing the events for which the emitter has registered listeners.
     */
    eventNames() {
        let finalNamesArray = [];
        this._listeners.storage.map((val, key) => {
            if (!finalNamesArray.includes(key))
                finalNamesArray.push(key);
        });
        this._singularListeners.storage.map((val, key) => {
            if (!finalNamesArray.includes(key))
                finalNamesArray.push(key);
        });
        return finalNamesArray;
    }
    /**
     * Returns the number of listeners listening to the event.
     */
    listenerCount(eventName) {
        const recurring = this._listeners.countListeners(eventName);
        const singular = this._singularListeners.countListeners(eventName);
        return (recurring + singular);
    }
    /**
     * Returns a copy of the array of listeners for the event.
     */
    listeners(eventName) {
        let recurring = this._listeners.fetchListeners(eventName);
        let singular = this._singularListeners.fetchListeners(eventName);
        return {
            recurring,
            singular
        };
    }
    /**
     * Adds the listener function to the end of the listeners array for the event.
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
     */
    on(eventName, listener) {
        this._listeners.add(eventName, listener);
        return this;
    }
    /**
     * Adds a one-time listener function for the event.
     * The next time the event is triggered, this listener is removed and then invoked.
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
     */
    once(eventName, listener) {
        this._singularListeners.add(eventName, listener);
        return this;
    }
    /**
     * Adds the listener function to the beginning of the listeners array for the event.
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
     */
    prependListener(eventName, listener) {
        this._listeners.prepend(eventName, listener);
        return this;
    }
    /**
     * Adds a one-time listener function for the event to the beginning of the listeners array.
     * The next time the event is triggered, this listener is removed, and then invoked.
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
     */
    prependOnceListener(eventName, listener) {
        this._singularListeners.prepend(eventName, listener);
        return this;
    }
    /**
     * Removes all listeners, or those of the specified event(s).
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
     */
    removeAllListeners(...eventName) {
        const listeners = [...eventName];
        listeners.map(en => {
            this._listeners.removeEvent(en);
            this._singularListeners.removeEvent(en);
        });
        return this;
    }
    /**
     * Removes the specified listener from the listener array for the event.
     *
     * Returns a reference to the eventra instance, so that calls can be chained.
    */
    removeListener(eventName, listener) {
        this._listeners.removeListener(eventName, listener);
        this._singularListeners.removeListener(eventName, listener);
        return this;
    }
}
exports.Eventra = Eventra;


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Collection_1 = __importDefault(__webpack_require__(286));
class ListenerArray {
    constructor(options) {
        this._internalStorage = new Collection_1.default();
        if (!options)
            this._options = { mode: "recurring" };
        else
            this._options = options;
    }
    get mode() { return this._options.mode; }
    get storage() { return this._internalStorage; }
    _updateInternalStorage(collection) {
        if (!collection)
            return;
        this._internalStorage = collection;
        return;
    }
    _cloneInternalStorage() {
        const internal = this._internalStorage.clone();
        return internal;
    }
    add(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event) {
            carbonCopy.set(eventName, [listener]);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        event.push(listener);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    prepend(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event) {
            carbonCopy.set(eventName, [listener]);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        event.unshift(listener);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    removeListener(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        if (!event.includes(listener))
            return this;
        if (event.length == 1) {
            carbonCopy.delete(eventName);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        ;
        const index = event.indexOf(listener);
        if (index > -1)
            event.splice(index, 1);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    removeEvent(eventName) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        carbonCopy.delete(eventName);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    countListeners(eventName) {
        const event = this._internalStorage.get(eventName);
        if (!event)
            return 0;
        return event.length;
    }
    fetchListeners(eventName) {
        const event = this._internalStorage.get(eventName);
        if (!event)
            return [];
        return event;
    }
    executeEvent(eventName, ...args) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        event.map((method, index) => {
            method(...args);
            return;
        });
        if (this.mode == 'once')
            carbonCopy.delete(eventName);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
}
exports.default = ListenerArray;


/***/ }),

/***/ 286:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collection = void 0;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 * @property {number} size - The amount of elements in this collection.
 */
class Collection extends Map {
    /**
     * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
     * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
     * @param {*} key - The key to get from this collection
     * @returns {* | undefined}
     */
    get(key) {
        return super.get(key);
    }
    /**
     * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
     * Sets a new element in the collection with the specified key and value.
     * @param {*} key - The key of the element to add
     * @param {*} value - The value of the element to add
     * @returns {Collection}
     */
    set(key, value) {
        return super.set(key, value);
    }
    /**
     * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
     * Checks if an element exists in the collection.
     * @param {*} key - The key of the element to check for
     * @returns {boolean} `true` if the element exists, `false` if it does not exist.
     */
    has(key) {
        return super.has(key);
    }
    /**
     * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
     * Deletes an element from the collection.
     * @param {*} key - The key to delete from the collection
     * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
     */
    delete(key) {
        return super.delete(key);
    }
    /**
     * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
     * Removes all elements from the collection.
     * @returns {undefined}
     */
    clear() {
        return super.clear();
    }
    /**
     * Checks if all of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if all of the elements exist, `false` if at least one does not exist.
     */
    hasAll(...keys) {
        return keys.every((k) => super.has(k));
    }
    /**
     * Checks if any of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if any of the elements exist, `false` if none exist.
     */
    hasAny(...keys) {
        return keys.some((k) => super.has(k));
    }
    first(amount) {
        if (typeof amount === 'undefined')
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    firstKey(amount) {
        if (typeof amount === 'undefined')
            return this.keys().next().value;
        if (amount < 0)
            return this.lastKey(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.keys();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    last(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.first(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    lastKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.firstKey(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    random(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    randomKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    find(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findKey(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    sweep(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this))
                this.delete(key);
        }
        return previousSize - this.size;
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
    partition(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species](),
        ];
        for (const [key, val] of this) {
            if (fn(val, key, this)) {
                results[0].set(key, val);
            }
            else {
                results[1].set(key, val);
            }
        }
        return results;
    }
    flatMap(fn, thisArg) {
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
    mapValues(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const coll = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            coll.set(key, fn(val, key, this));
        return coll;
    }
    some(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return true;
        }
        return false;
    }
    every(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (!fn(val, key, this))
                return false;
        }
        return true;
    }
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce(fn, initialValue) {
        let accumulator;
        if (typeof initialValue !== 'undefined') {
            accumulator = initialValue;
            for (const [key, val] of this)
                accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = val;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }
        // No items iterated.
        if (first) {
            throw new TypeError('Reduce of empty collection with no initial value');
        }
        return accumulator;
    }
    each(fn, thisArg) {
        this.forEach(fn, thisArg);
        return this;
    }
    tap(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        fn(this);
        return this;
    }
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection}
     * @example const newColl = someColl.clone();
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection}
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections) {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll)
                newColl.set(key, val);
        }
        return newColl;
    }
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!collection)
            return false; // runtime check
        if (this === collection)
            return true;
        if (this.size !== collection.size)
            return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction = Collection.defaultSort) {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
        // Perform clean-up
        super.clear();
        // Set the new entries
        for (const [k, v] of entries) {
            super.set(k, v);
        }
        return this;
    }
    /**
     * The intersect method returns a new structure containing items where the keys are present in both original structures.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    intersect(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (this.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    difference(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (!this.has(k))
                coll.set(k, v);
        }
        for (const [k, v] of this) {
            if (!other.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The sorted method sorts the items of a collection and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sorted(compareFunction = Collection.defaultSort) {
        return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
    }
    static defaultSort(firstValue, secondValue) {
        return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
    }
}
exports.Collection = Collection;
Collection.default = Collection;
exports.default = Collection;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(568);
/******/ 	Eventra = __webpack_exports__;
/******/ 	
/******/ })()
;