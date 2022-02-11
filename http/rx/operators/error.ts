import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { emptyObservable } from "../../../rxjs/helpers";
import { DrewlabsFluxStore, onErrorAction } from "../../../rxjs/state/rx-state";
import { ErrorHandler } from "../../contracts/error-handler";
import { IHttpResponse, IResourcesServerClient } from "../../contracts";

/**
 * @description Apply an HTTP error stream on the provided store
 * @param handler
 * @param store
 * @returns
 */
export const handleError =
  (handler: ErrorHandler, store?: DrewlabsFluxStore<any, any>) =>
  (source$: Observable<any>) => {
    return source$.pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          const errorResponse = handler.handleError(err);
          if (store) {
            onErrorAction(store)(errorResponse);
          }
        } else {
          if (store) {
            onErrorAction(store)(err);
          }
        }
        return emptyObservable();
      })
    );
  };

/**
 * @description Apply an HTTP error stream on the provided store
 * @param error [[any]]
 * @param store [[IResourcesServerClient<IHttpResponse<T>>]]
 * @param client [[DrewlabsFluxStore<KType, AType>]]
 * @deprecated
 */
export const handleHTTPError = <T extends any, KType, AType>(
  error: any,
  store: DrewlabsFluxStore<KType, Partial<AType>>,
  client: IResourcesServerClient<IHttpResponse<T>>
) => {
  if (error instanceof HttpErrorResponse) {
    const errorResponse = client.handleErrorResponse(error);
    onErrorAction(store)(errorResponse);
  } else {
    onErrorAction(error);
  }
  return emptyObservable();
};
