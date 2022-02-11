import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MapToHandlerResponse } from "../types/map";

/**
 * @description RxJs operator for mapping handler result to a {HandlerResult} of type T
 */
export function mapToHttpResponse<T>(handlerFn: MapToHandlerResponse<T>) {
  return (source$: Observable<any>) => {
    return source$.pipe(
      map((state) => {
        const result = handlerFn(state);
        return result;
      })
    );
  };
}
