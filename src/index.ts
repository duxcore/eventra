import ListenerArray from "./lib/ListenerArray";
import { ListenerCallback } from "./types";

export interface EventraOptions {
  maxListeners: number;
}

export class Eventra {
  
  private _listeners = new ListenerArray({ mode: "recurring" });
  private _singularListeners = new ListenerArray({ mode: "once" });

  private _options: EventraOptions;

  constructor(options?: EventraOptions) {
    if (!options) this._options = { maxListeners: 50 }
    else this._options = options;
  }

  addListener = this.on;
  off = this.removeListener;

  emit(event: string, ...args) {
    this._listeners.executeEvent(event, ...args);
    this._singularListeners.executeEvent(event, ...args)
  }

  eventNames(): string[] {
    let finalNamesArray: string[] = []

    this._listeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    this._singularListeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    return finalNamesArray;
  }

  getMaxListeners(): number {
    return this._options.maxListeners;
  }

  listenerCount(eventName: string): number {
    const recurring = this._listeners.countListeners(eventName);
    const singular = this._singularListeners.countListeners(eventName);

    return (recurring + singular);
  }
  listeners(eventName: string) {}

  on(eventName: string, listener: ListenerCallback) {
    this._listeners.add(eventName, listener);
  }
  once(eventName: string, listener: ListenerCallback) {
    this._singularListeners.add(eventName, listener);
  }

  prependListener(event: string, callback: ListenerCallback) {}
  prependOnceListener(event: string, callback: ListenerCallback) {}

  removeAllListeners(eventName: string | string[]): this {
    const listeners = typeof eventName == 'string' ? [ eventName ] : eventName;

    listeners.map(en => {
      this._listeners.removeEvent(en);
      this._singularListeners.removeEvent(en);
    });

    return this;
  }
  removeListener(eventName: string, listener: ListenerCallback): this {
    this._listeners.removeListener(eventName, listener);
    this._singularListeners.removeListener(eventName, listener);

    return this;
  }

  setMaxListeners(n: number): this {
    this._options.maxListeners = n;
    return this;
  }

  rawListeners(eventName: string) {}
}