import { FormV2 } from '../models/form';
import { createAction, DefaultStoreAction, DrewlabsFluxStore, onErrorAction, StoreAction } from '../../../../../rxjs/state/rx-state';
import { DrewlabsRessourceServerClient } from '../../../../../http/core/ressource-server-client';
import { catchError, map } from 'rxjs/operators';
import { getResponseDataFromHttpResponse } from '../../../../../http/helpers/http-response';
import { emptyObservable } from '../../../../../rxjs/helpers';
import { GenericUndecoratedSerializaleSerializer } from '../../../../../built-value/core/js/serializer';
import { isArray, isDefined, isObject } from '../../../../../utils/types';
import { HttpErrorResponse } from '@angular/common/http';
import { UIStateStatusCode } from '../../../../../helpers';
import { DynamicFormInterface } from '../../compact/types';
import { FormControlV2 } from '../models';
import { PaginationDataState } from '../../../../../rxjs/types';

export interface FormState {
  performingAction: boolean;
  collections: PaginationDataState<DynamicFormInterface>;
  selectedFormId: number;
  currentForm: FormV2;
  createResult: UIStateStatusCode;
  updateResult: UIStateStatusCode;
  deleteResult: UIStateStatusCode;
  createControlResult: UIStateStatusCode;
  updateControlResult: UIStateStatusCode;
  deleteControlResult: UIStateStatusCode;
  error: any;
}

export enum FormStoreActions {
  FORM_SELECTED_ACTION = '[FORM_SELECTED]',
  FORM_PAGINATION_DATA_ACTION = '[FORM_PAGINATION_DATA]',
  CREATE_RESULT_ACTION = '[CREATED_FORM]',
  NEW_VALUE_ACTION = '[ADD_TO_FORMS_STACK]',
  UPDATE_RESULT_ACTION = '[FORM_UPDATED]',
  DELETE_RESULT_ACTION = '[FORM_DELETED]',
  CONTROL_CREATE_RESULT_ACTION = '[FORM_CONTROL_CREATED]',
  CONTROL_UPDATE_RESULT_ACTION = '[FORM_CONTROL_UPDATED]',
  CONTROL_DELETE_RESULT_ACTION = '[FORM_CONTROL_REMOVED]',
}

export const onPaginateFormsAction = (store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (
    client: DrewlabsRessourceServerClient,
    path: string,
    params: { [index: string]: any } = {}
  ) => {
    return {
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.get(`${path}`, { params })
        .pipe(
          map(state => {
            const { data, total } = isDefined(state.data)
              && (isDefined(state.data.data)) ? state.data : state;
            if (isDefined(data) && isArray(data)) {
              onFormPaginationDataLoaded(store)({
                data: (data as any[]).map(
                  (current) => new GenericUndecoratedSerializaleSerializer()
                    .fromSerialized(FormV2, current) as FormV2),
                total
              });
            } else {
              onFormPaginationDataLoaded(store)({ data: [], total: 0 });
            }
          }),
          catchError(err => {
            onErrorAction(store)(err);
            return emptyObservable();
          })
        )
    };
  });


export const onFormPaginationDataLoaded = (store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: PaginationDataState<FormV2>) => {
    return {
      type: FormStoreActions.FORM_PAGINATION_DATA_ACTION,
      payload
    };
  });

export const createFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.create(path, body)
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return formCreatedAction(store)({
              currentForm: (new GenericUndecoratedSerializaleSerializer()
                .fromSerialized(FormV2, data)) as FormV2,
              createResult: UIStateStatusCode.STATUS_CREATED
            });
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formCreatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormV2) =>
    ({ type: FormStoreActions.CREATE_RESULT_ACTION, payload }));

export const loadFormUsingIDAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (
    client: DrewlabsRessourceServerClient,
    path: string,
    id: string | number,
    params: { [prop: string]: any } = { load_bindings: true }
  ) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.getUsingID(path, id, { params: params || { load_bindings: true } })
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return onNewFormAction(store)((new GenericUndecoratedSerializaleSerializer()
              .fromSerialized(FormV2, data)) as FormV2);
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const onNewFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormV2[] | FormV2) =>
    ({ type: FormStoreActions.NEW_VALUE_ACTION, payload }));


export const updateFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.update(path, body)
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            if (isObject(data)) {
              return formUpdatedAction(store)({
                currentForm: (new GenericUndecoratedSerializaleSerializer()
                  .fromSerialized(FormV2, data)) as FormV2,
                updateResult: UIStateStatusCode.STATUS_OK
              });
            } else {
              return formUpdatedAction(store)({ updateResult: UIStateStatusCode.BAD_REQUEST });
            }
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formUpdatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.UPDATE_RESULT_ACTION, payload }));



export const deleteFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, id: number | string) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.deleteUsingID(path, id)
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            if (isObject(data)) {
              return formDeletedAction(store)({
                item: { id },
                deleteResult: UIStateStatusCode.STATUS_OK
              });
            } else {
              return formDeletedAction(store)({ deleteResult: UIStateStatusCode.BAD_REQUEST, item: { id } });
            }
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formDeletedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.DELETE_RESULT_ACTION, payload }));

export const selectFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: number | string) =>
    ({ type: FormStoreActions.FORM_SELECTED_ACTION, payload }));

export const createFormControlAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.create(path, body)
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return formControlCreatedAction(store)({
              control: (new GenericUndecoratedSerializaleSerializer()
                .fromSerialized(FormControlV2, data)) as FormControlV2,
              createControlResult: UIStateStatusCode.STATUS_CREATED
            });
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formControlCreatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormControlV2) =>
    ({ type: FormStoreActions.CONTROL_CREATE_RESULT_ACTION, payload }));

export const updateFormControlAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, body: { [index: string]: any }) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.update(path, body)
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            if (isObject(data)) {
              return formControlUpdatedAction(store)({
                control: (new GenericUndecoratedSerializaleSerializer()
                  .fromSerialized(FormControlV2, data)) as FormControlV2,
                updateControlResult: UIStateStatusCode.STATUS_OK
              });
            } else {
              return formControlUpdatedAction(store)({ updateControlResult: UIStateStatusCode.STATUS_OK });
            }
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formControlUpdatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.CONTROL_UPDATE_RESULT_ACTION, payload }));


export const deleteFormFormControl = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (
    client: DrewlabsRessourceServerClient,
    path: string,
    params: { [prop: string]: any } = {},
    controlID?: number) =>
  ({
    type: DefaultStoreAction.ASYNC_UI_ACTION,
    payload: client.delete(path, { params: params || {} })
      .pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          if (controlID) {
            formControlRemovedAction(store)({
              deleteControlResult: UIStateStatusCode.STATUS_OK,
              control: { id: controlID }
            });
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      )
  }));

export const formControlRemovedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.CONTROL_DELETE_RESULT_ACTION, payload }));
