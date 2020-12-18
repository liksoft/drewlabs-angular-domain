import { Observable } from 'rxjs';
import { MapToHandlerResponse } from '../../../../rxjs/types';
import { map } from 'rxjs/operators';

/**
 * @description RxJs operator for mapping handler result to a {HandlerResult} of type T
 */
export function mapToHttpResponse<T>(handlerFn: MapToHandlerResponse<T>) {
  return (source$: Observable<any>) => {
    return source$.pipe(
      map(state => {
        const result = handlerFn(state);
        return result;
      })
    );
  };
}
