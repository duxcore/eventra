export type ListenerSignature<L> = {
  [E in keyof L]: (...args: any[]) => any;
};

export type DefaultListener = {
  [k: string]: (...args: any[]) => any;
};