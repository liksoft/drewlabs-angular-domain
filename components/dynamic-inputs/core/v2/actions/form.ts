import { PaginationData } from '../../../../../pagination/types';
import { FormV2 } from '../models/form';
import { createAction, DefaultStoreAction, DrewlabsFluxStore, onErrorAction, StoreAction } from '../../../../../rxjs/state/rx-state';
import { DrewlabsRessourceServerClient } from '../../../../../http/core/ressource-server-client';
import { catchError, map } from 'rxjs/operators';
import { getResponseDataFromHttpResponse } from '../../../../../http/helpers/http-response';
import { emptyObservable } from '../../../../../rxjs/helpers';
import { GenericUndecoratedSerializaleSerializer } from '../../../../../built-value/core/js/serializer';
import { isArray, isDefined, isObject } from '../../../../../utils/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Log } from '../../../../../utils/logger';

export interface FormState {
  performingAction: boolean;
  items: FormV2[];
  pagination: PaginationData<FormV2>;
  selectedFormId: number;
  createdForm: FormV2;
  // loadedForm: FormV2;
  updateResult: boolean;
  deleteResult: boolean;
  error: any;
}

export enum FormStoreActions {
  FORM_SELECTED_ACTION = '[FORM_SELECTED]',
  FORM_PAGINATION_DATA_ACTION = '[FORM_PAGINATION_DATA]',
  CREATED_FORM_ACTION = '[CREATED_FORM]',
  ADD_TO_FORMS_STACK_ACTION = '[ADD_TO_FORMS_STACK]',
  FORM_UPDATED_ACTION = '[FORM_UPDATED]',
  FORM_DELETED_ACTION = '[FORM_DELETED]'
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
            // const { data, total } = getResponseDataFromHttpResponse(state);
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
  createAction(store, (payload: PaginationData<FormV2>) => {
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
              return formCreatedAction(store)((new GenericUndecoratedSerializaleSerializer()
                .fromSerialized(FormV2, data)) as FormV2);
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

export const formCreatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormV2) =>
    ({ type: FormStoreActions.CREATED_FORM_ACTION, payload }));

export const loadFormUsingIDAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (client: DrewlabsRessourceServerClient, path: string, id: string | number) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.getUsingID(path, id, { params: { load_bindings: true } })
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              return onAddFormToStackAction(store)((new GenericUndecoratedSerializaleSerializer()
                .fromSerialized(FormV2, data)) as FormV2);
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

export const onAddFormToStackAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: FormV2[] | FormV2) =>
    ({ type: FormStoreActions.ADD_TO_FORMS_STACK_ACTION, payload }));


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
                  item: (new GenericUndecoratedSerializaleSerializer()
                    .fromSerialized(FormV2, data)) as FormV2,
                  updateResult: true
                });
              } else {
                return formUpdatedAction(store)({ updateResult: true });
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

export const formUpdatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.FORM_UPDATED_ACTION, payload }));



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
                  item: (new GenericUndecoratedSerializaleSerializer()
                    .fromSerialized(FormV2, data)) as FormV2,
                  deleteResult: true
                });
              } else {
                return formDeletedAction(store)({ deleteResult: true });
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

export const formDeletedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: FormStoreActions.FORM_DELETED_ACTION, payload }));

export const selectFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>) =>
  createAction(store, (payload: number | string) =>
    ({ type: FormStoreActions.FORM_SELECTED_ACTION, payload }));
