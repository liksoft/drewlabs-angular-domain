import { FormControlV2 } from '../models/form-control';
import { createAction, DefaultStoreAction, DrewlabsFluxStore, onErrorAction, StoreAction } from '../../../../../rxjs/state/rx-state';
import { DrewlabsRessourceServerClient } from '../../../../../http/core/ressource-server-client';
import { catchError, map } from 'rxjs/operators';
import { getResponseDataFromHttpResponse } from '../../../../../http/helpers/http-response';
import { emptyObservable } from '../../../../../rxjs/helpers';
import { GenericUndecoratedSerializaleSerializer } from '../../../../../built-value/core/js/serializer';
import { isDefined, isObject } from '../../../../../utils/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Log } from '../../../../../utils/logger';

export interface FormControlState {
  performingAction: boolean;
  items: FormControlV2[];
  createdControl: FormControlV2;
  updateResult: boolean;
  deleteResult: boolean;
  error: any;
}

export enum FormControlStoreActions {
  CREATED_FORM_CONTROL_ACTION = '[CREATED_FORM_CONTROL]',
  FORM_CONTROL_UPDATED_ACTION = '[FORM_CONTROL_UPDATED]',
  FORM_CONTROL_DELETED_ACTION = '[FORM_CONTROL_DELETED]'
}

export const createControlAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.create(path, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            Log('Form control creation request response body:', data);
            if (isDefined(data)) {
              return controlCreatedAction(store)((new GenericUndecoratedSerializaleSerializer()
                .fromSerialized(FormControlV2, data)) as FormControlV2);
            }
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              const errorResponse = client.handleErrorResponse(err);
              onErrorAction(store)(errorResponse);
            } else {
              onErrorAction(err);
            }
            return emptyObservable();
          })
        )
    }));

export const controlCreatedAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormControlV2) =>
    ({ type: FormControlStoreActions.CREATED_FORM_CONTROL_ACTION, payload }));


export const updateFormControlAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.update(path, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            Log('Form control update request response body: ', data);
            if (isDefined(data)) {
              if (isObject(data)) {
                return formControlUpdatedAction(store)({
                  item: (new GenericUndecoratedSerializaleSerializer()
                    .fromSerialized(FormControlV2, data)) as FormControlV2,
                  updateResult: true
                });
              } else {
                return formControlUpdatedAction(store)({ updateResult: true });
              }
            }
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              const errorResponse = client.handleErrorResponse(err);
              onErrorAction(store)(errorResponse);
            } else {
              onErrorAction(err);
            }
            return emptyObservable();
          })
        )
    }));

export const formControlUpdatedAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormControlStoreActions.FORM_CONTROL_UPDATED_ACTION, payload }));



export const deleteFormControlAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, id: number | string) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.deleteUsingID(path, id)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            Log('Form control delete request response body: ', data);
            if (isDefined(data)) {
              if (isObject(data)) {
                return formControlDeletedAction(store)({
                  item: (new GenericUndecoratedSerializaleSerializer()
                    .fromSerialized(FormControlV2, data)) as FormControlV2,
                  deleteResult: true
                });
              } else {
                return formControlDeletedAction(store)({ deleteResult: true });
              }
            }
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              const errorResponse = client.handleErrorResponse(err);
              onErrorAction(store)(errorResponse);
            } else {
              onErrorAction(err);
            }
            return emptyObservable();
          })
        )
    }));

export const formControlDeletedAction = (
  store: DrewlabsFluxStore<FormControlState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormControlStoreActions.FORM_CONTROL_DELETED_ACTION, payload }));
