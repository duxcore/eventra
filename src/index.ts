import ListenerArray from "./lib/ListenerArray";
import { DefaultListener, ListenerSignature } from "./types/events";
import { AnyListenerCallback } from "./types/types";

export class Eventra<
  Events extends ListenerSignature<Events> = DefaultListener
> {
  public constructor() {}

  private _listeners = new ListenerArray({ mode: "recurring" });
  private _singularListeners = new ListenerArray({ mode: "once" });

  /**
   * Alias for `Eventra.on`
   */
  addListener = this.on;

  /**
   * Alias for `Eventra.removeListener`
   */
  off = this.removeListener;

  /**
   * Synchronously calls each of the listeners registered for the event, in the order they were registered, passing the supplied arguments to each.
   */
  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    this._listeners.executeEvent(event, ...args);
    this._singularListeners.executeEvent(event, ...args);
  }

  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   */
  eventNames<E extends keyof Events>(): E[] {
    let finalNamesArray: E[] = [];

    this._listeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    this._singularListeners.storage.map((val, key) => {
      if (!finalNamesArray.includes(key)) finalNamesArray.push(key);
    });

    return finalNamesArray;
  }

  /**
   * Returns the number of listeners listening to the event.
   */
  listenerCount<E extends keyof Events>(eventName: E): number {
    const recurring = this._listeners.countListeners(eventName);
    const singular = this._singularListeners.countListeners(eventName);

    return recurring + singular;
  }

  /**
   * Returns a copy of the array of listeners for the event.
   */
  listeners<E extends keyof Events>(eventName: E) {
    let recurring = this._listeners.fetchListeners(eventName);
    let singular = this._singularListeners.fetchListeners(eventName);

    return {
      recurring,
      singular,
    };
  }
  /**
   * Adds a listener that will callback after every single event execution.
   */
  any(listener: AnyListenerCallback) {
    this._listeners.addAny(listener);
    return this;
  }

  /**
   * Adds the listener function to the end of the listeners array for the event.
   *
   * Returns a reference to the eventra instance, so that calls can be chained.
   */
  on<E extends keyof Events>(eventName: E, listener: Events[E]): this {
    this._listeners.add(eventName, listener);
    return this;
  }

  /**
   * Adds a one-time listener function for the event.
   * The next time the event is triggered, this listener is removed and then invoked.
   *
   * Returns a reference to the eventra instance, so that calls can be chained.
   */
  once<E extends keyof Events>(eventName: E, listener: Events[E]): this {
    this._singularListeners.add(eventName, listener);
    return this;
  }

  /**
   * Adds the listener function to the beginning of the listeners array for the event.
   *
   * Returns a reference to the eventra instance, so that calls can be chained.
   */
  prependListener<E extends keyof Events>(
    eventName: E,
    listener: Events[E]
  ): this {
    this._listeners.prepend(eventName, listener);
    return this;
  }

  /**
   * Adds a one-time listener function for the event to the beginning of the listeners array.
   * The next time the event is triggered, this listener is removed, and then invoked.
   *
   * Returns a reference to the eventra instance, so that calls can be chained.
   */
  prependOnceListener<E extends keyof Events>(
    eventName: E,
    listener: Events[E]
  ): this {
    this._singularListeners.prepend(eventName, listener);
    return this;
  }

  /**
   * Removes all listeners, or those of the specified event(s).
   *
   * Returns a reference to the eventra instance, so that calls can be chained.
   */
  removeAllListeners<E extends keyof Events>(...eventName: E[]): this {
    const listeners: E[] = [...eventName];

    listeners.map((en) => {
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
  removeListener<E extends keyof Events>(
    eventName: E,
    listener: Events[E]
  ): this {
    this._listeners.removeListener(eventName, listener);
    this._singularListeners.removeListener(eventName, listener);

    return this;
  }
}
