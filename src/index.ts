import ListenerArray from "./lib/ListenerArray";
import { DefaultListener, ListenerSignature } from "./types/events";
import { ListenerCallback } from "./types/types";

export class Eventra<Events extends ListenerSignature<Events> = DefaultListener> {
  
  private _listeners = new ListenerArray({ mode: "recurring" });
  private _singularListeners = new ListenerArray({ mode: "once" });

  addListener = this.on;
  off = this.removeListener;

  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    this._listeners.executeEvent(event, ...args);
    this._singularListeners.executeEvent(event, ...args)
  }

  eventNames<E extends keyof Events>(): E[] {
    let finalNamesArray: E[] = []

    this._listeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    this._singularListeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    return finalNamesArray;
  }

  
  listenerCount<E extends keyof Events>(eventName: E): number {
    const recurring = this._listeners.countListeners(eventName);
    const singular = this._singularListeners.countListeners(eventName);

    return (recurring + singular);
  }
  
  listeners<E extends keyof Events>(eventName: E) {
    let recurring = this._listeners.fetchListeners(eventName);
    let singular = this._singularListeners.fetchListeners(eventName);

    return {
      recurring,
      singular
    }
  }


  on<E extends keyof Events>(eventName: E, listener: Events[E]): void {
    this._listeners.add(eventName, listener);
    return;
  }
  
  once<E extends keyof Events>(eventName: E, listener: Events[E]): void {
    this._singularListeners.add(eventName, listener);
    return;
  }


  prependListener<E extends keyof Events>(eventName: E, listener: Events[E]): void {
    this._listeners.prepend(eventName, listener);
    return;
  }
  
  prependOnceListener<E extends keyof Events>(eventName: E, listener: Events[E]): void {
    this._singularListeners.prepend(eventName, listener);
    return;
  }


  removeAllListeners<E extends keyof Events>(...eventName: E[]): this {
    const listeners: E[] = [...eventName]; 

    listeners.map(en => {
      this._listeners.removeEvent(en);
      this._singularListeners.removeEvent(en);
    });

    return this;
  }

  removeListener<E extends keyof Events>(eventName: E, listener: Events[E]): this {
    this._listeners.removeListener(eventName, listener);
    this._singularListeners.removeListener(eventName, listener);

    return this;
  }
}