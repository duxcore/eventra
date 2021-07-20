import ListenerArray from "./lib/ListenerArray";
import { ListenerCallback } from "./types";

export class Eventra {
  
  private _listeners = new ListenerArray({ mode: "recurring" });
  private _singularListeners = new ListenerArray({ mode: "once" });

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

  
  listenerCount(eventName: string): number {
    const recurring = this._listeners.countListeners(eventName);
    const singular = this._singularListeners.countListeners(eventName);

    return (recurring + singular);
  }
  
  listeners(eventName: string) {
    let recurring = this._listeners.fetchListeners(eventName);
    let singular = this._singularListeners.fetchListeners(eventName);

    return {
      recurring,
      singular
    }
  }


  on(eventName: string, listener: ListenerCallback) {
    this._listeners.add(eventName, listener);
  }
  
  once(eventName: string, listener: ListenerCallback) {
    this._singularListeners.add(eventName, listener);
  }


  prependListener(eventName: string, listener: ListenerCallback) {
    this._listeners.prepend(eventName, listener);
  }
  
  prependOnceListener(eventName: string, listener: ListenerCallback) {
    this._singularListeners.prepend(eventName, listener);
  }


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
}