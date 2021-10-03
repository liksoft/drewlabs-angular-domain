import { PaginationData } from '../../../pagination/types';
import { createAction, DefaultStoreAction, DrewlabsFluxStore, onErrorAction, StoreAction } from '../../../rxjs/state/rx-state';
import { catchError, map } from 'rxjs/operators';
import { isArray, isDefined, isObject } from '../../../utils';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';
import { emptyObservable } from '../../../rxjs/helpers';
import { HttpErrorResponse } from '@angular/common/http';
import { DepartmentV2 } from '../../contracts/v2/company/department';
import { getResponseDataFromHttpResponse } from '../../../http/helpers/response';
import { IResourcesServerClient } from '../../../http';

export interface DepartmentV2sState {
  performingAction: boolean;
  items: DepartmentV2[];
  pagination: PaginationData<DepartmentV2>;
  selected?: DepartmentV2;
  createdDepartment?: DepartmentV2;
  updateResult?: boolean;
  deleteResult?: boolean;
  error?: any;
}

const deserializeSerializedDepartmentV2 = (serialized: any) => {
  return new GenericUndecoratedSerializaleSerializer()
    .fromSerialized(DepartmentV2, serialized) as DepartmentV2;
};

export enum DepartmentV2sStoreActions {
  PAGINATION_DATA_ACTION = '[DEPARTMENT_PAGINATION_DATA]',
  CREATED_DEPARTMENT_ACTION = '[CREATED_DEPARTMENT]',
  ADD_TO_DEPARTMENTS_STACK_ACTION = '[ADD_TO_DEPARTMENTS_STACK]',
  DEPARTMENT_UPDATED_ACTION = '[DEPARTMENT_UPDATED]',
  DEPARTMENT_DELETED_ACTION = '[DEPARTMENT_DELETED]',
  INIT_ITEMS_CACHE_ACTION = '[INIT_DEPARTMENTS_CACHE]',
  RESET_STORE = '[RESETTING_DEPARTMENT_STORE]',
  INSERT_OR_UPDATE_ACTION = '[INSERT_OR_UPDATE]'
}

export const paginateDepartmentV2Action = (store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (
    client: IResourcesServerClient<any>,
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
              onDepartmentV2PaginationDataLoaded(store)({
                data: (data as any[]).map((current) => deserializeSerializedDepartmentV2(current)),
                total
              });
            } else {
              onDepartmentV2PaginationDataLoaded(store)({ data: [], total: 0 });
            }
          }),
          catchError(err => {
            onErrorAction(store)(err);
            return emptyObservable();
          })
        )
    };
  });


export const onDepartmentV2PaginationDataLoaded = (store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (payload: PaginationData<DepartmentV2>) => {
    return {
      type: DepartmentV2sStoreActions.PAGINATION_DATA_ACTION,
      payload
    };
  });

export const createDepartmentV2Action = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.create(path, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              return departmentCreated(store)(deserializeSerializedDepartmentV2(data));
            }
            return emptyObservable();
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

export const departmentCreated = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (payload: DepartmentV2) =>
    ({ type: DepartmentV2sStoreActions.CREATED_DEPARTMENT_ACTION, payload }));

export const updateDepartmentV2Action = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, id: number | string, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.updateUsingID(path, id, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              if (isObject(data)) {
                return departmentUpdatedAction(store)({
                  item: deserializeSerializedDepartmentV2(data),
                  updateResult: true
                });
              } else {
                return departmentUpdatedAction(store)({ updateResult: true });
              }
            }
            return emptyObservable();
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

export const departmentUpdatedAction = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: DepartmentV2sStoreActions.DEPARTMENT_UPDATED_ACTION, payload }));



export const deleteDepartmentV2Action = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, id: number | string) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.deleteUsingID(path, id)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              if (isObject(data)) {
                return departmentDeletedAction(store)({
                  item: deserializeSerializedDepartmentV2(data),
                  deleteResult: true
                });
              } else {
                return departmentDeletedAction(store)({ deleteResult: true });
              }
            }
            return emptyObservable();
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

export const departmentDeletedAction = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: DepartmentV2sStoreActions.DEPARTMENT_DELETED_ACTION, payload }));


export const getDepartmentUsingID = (
  store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, id: string | number) => {
    return {
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.getUsingID(path, id)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              return addDepartmentToList(store)(deserializeSerializedDepartmentV2(data));
            }
            return emptyObservable();
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
    }
  });

export const addDepartmentToList = (store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, (payload: DepartmentV2) => {
    return {
      type: DepartmentV2sStoreActions.INSERT_OR_UPDATE_ACTION,
      payload
    };
  });

export const initialDepartmentsState: DepartmentV2sState = {
  items: [],
  pagination: {} as PaginationData<DepartmentV2>,
  performingAction: false
};

export const resetDepartmentsStore = (store: DrewlabsFluxStore<DepartmentV2sState, Partial<StoreAction>>) =>
  createAction(store, () => {
    return {
      type: DepartmentV2sStoreActions.RESET_STORE,
      payload: initialDepartmentsState
    };
  });
