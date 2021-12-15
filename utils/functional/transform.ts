import { compose } from "./compose";
import { ReducerFunc, UnaryFunction } from "./contracts";

export const mapReduce = <T, R, ReducerRType>(
  mapFunc: UnaryFunction<T, R>,
  reducerFunc: ReducerFunc<R, ReducerRType>,
  initialValue: ReducerRType
) =>
  compose(
    (source: T | T[]) =>
      Array.isArray(source) ? source.map(mapFunc) : mapFunc(source),
    (source: R | R[]) =>
      Array.isArray(source)
        ? source.reduce(reducerFunc, initialValue)
        : reducerFunc(initialValue, source)
  );
