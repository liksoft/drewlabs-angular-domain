import { HttpErrorResponse } from '@angular/common/http';
import { IHttpResponse, IResourcesServerClient } from '../../http/contracts';
import { DrewlabsFluxStore, onErrorAction } from '../state/rx-state';
import { emptyObservable } from './creator-functions';

/**
 * @description Apply an HTTP error stream on the provided store
 * @param error [[any]]
 * @param store [[IResourcesServerClient<IHttpResponse<T>>]]
 * @param client [[DrewlabsFluxStore<KType, AType>]]
 */
export const handleHTTPError = <T extends any, KType, AType> (
  error: any, store: DrewlabsFluxStore<KType, AType>, client: IResourcesServerClient<IHttpResponse<T>>) => {
  if (error instanceof HttpErrorResponse) {
    const errorResponse = client.handleErrorResponse(error);
    onErrorAction(store)(errorResponse);
  } else {
    onErrorAction(error);
  }
  return emptyObservable();
};
