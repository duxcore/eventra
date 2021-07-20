import { ListenerArrayMode, ListenerArrayOptions, ListenerCallback } from "../types";
import Collection from "../util/Collection";

type CollectionType = Collection<string, ListenerCallback[]>;

export default class ListenerArray {

  private _options: ListenerArrayOptions;
  private _internalStorage = new Collection<string, ListenerCallback[]>()

  constructor(options?: ListenerArrayOptions) {
    if (!options) this._options = { mode: "recurring" }
    else this._options = options;
  }

  get mode(): ListenerArrayMode { return this._options.mode; }
  get storage(): CollectionType { return this._internalStorage; }

  private _updateInternalStorage(collection: CollectionType) {
    if (!collection) return;
    this._internalStorage = collection;
    return;
  }

  private _cloneInternalStorage(): CollectionType {
    const internal = this._internalStorage.clone();
    return internal;
  }

  add(eventName: string, listener: ListenerCallback): this {
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

  prepend(eventName: string, listener: ListenerCallback): this {
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

  removeListener(eventName: string, listener: ListenerCallback): this {
    let carbonCopy = this._cloneInternalStorage();
    let event = carbonCopy.get(eventName);

    if (!event) return this;
    if (!event.includes(listener)) return this;
    
    if (event.length == 1) {
      carbonCopy.delete(eventName);
      this._updateInternalStorage(carbonCopy);
      return this;
    };
    
    const index = event.indexOf(listener);
    if (index > -1) event.splice(index, 1);

    this._updateInternalStorage(carbonCopy);
    return this;
  }

  removeEvent(eventName: string): this {
    let carbonCopy = this._cloneInternalStorage();
    let event = carbonCopy.get(eventName);

    if (!event) return this;

    carbonCopy.delete(eventName);
    this._updateInternalStorage(carbonCopy);
    return this;
  }

  countListeners(eventName: string): number {
    const event = this._internalStorage.get(eventName);

    if (!event) return 0;
    return event.length;
  }

  executeEvent(eventName: string, ...args): this {
    let carbonCopy = this._cloneInternalStorage();
    let event = carbonCopy.get(eventName);

    if (!event) return this;

    event.map((method, index) => {
      method(...args);
      return;
    });

    if (this.mode == 'once') carbonCopy.delete(eventName);
    this._updateInternalStorage(carbonCopy);

    return this;
  }
}