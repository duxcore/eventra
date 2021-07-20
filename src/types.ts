export type ListenerCallback = (...args) => void;

export type ListenerArrayMode = "recurring" | "once";
export interface ListenerArrayOptions {
  mode: ListenerArrayMode
}