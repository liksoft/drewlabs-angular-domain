import { Observable } from "rxjs";
import { HandlerResult } from "../../../rxjs/types";


export type MapToHandlerResponse<T> = (res: any) => HandlerResult<T>;

export type MapToHttpResponseFunc<T> = (handlerFn: MapToHandlerResponse<T>) => (source$: Observable<any>) => Observable<HandlerResult<T>>;
