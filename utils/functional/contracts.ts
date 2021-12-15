export type Function_ = (...params: any[]) => any;
export type UnaryFunction<T, R> = (p: T, index?: number) => R;
export type ReducerFunc<T, R> = (previous: R, current: T, index?: number) => R;
export type FilterFunc<T> = (p: T, index?: number) => boolean;
export type CollectorFunc<T, R> = (value: Generator<T, void>) => R;
export type ListCollectorFunc = <T>() => T[];
export type ComposeFunc<T, R> = (
  ...funcs: ((...params: any[]) => any)[]
) => (source: T) => R;
