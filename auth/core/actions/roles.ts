import { RoleV2 } from '../../contracts/v2/authorizations/role';
import { PaginationData } from '../../../pagination/types';
import { createAction, DefaultStoreAction, DrewlabsFluxStore, onErrorAction, StoreAction } from '../../../rxjs/state/rx-state';
import { catchError, map } from 'rxjs/operators';
import { isArray, isDefined, isObject } from '../../../utils';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';
import { emptyObservable } from '../../../rxjs/helpers';
import { HttpErrorResponse } from '@angular/common/http';
import { getResponseDataFromHttpResponse } from '../../../http/helpers/response';
import { IResourcesServerClient } from '../../../http';

export interface RolesState {
  performingAction: boolean;
  items: { [prop: string]: RoleV2 };
  pagination: PaginationData<RoleV2>;
  createdRole?: RoleV2;
  updateResult?: boolean;
  deleteResult?: boolean;
  error?: any;
}

const deserializeSerializedRole = (serialized: any) => {
  return new GenericUndecoratedSerializaleSerializer()
    .fromSerialized(RoleV2, serialized) as RoleV2;
};

export enum RoleStoreActions {
  PAGINATION_DATA_ACTION = '[ROLE_PAGINATION_DATA]',
  CREATED_ROLE_ACTION = '[CREATED_ROLE]',
  PUSH_ROLE_ACTION = '[PUSH_ROLE]',
  ROLE_UPDATED_ACTION = '[ROLE_UPDATED]',
  ROLE_DELETED_ACTION = '[ROLE_DELETED]',
  INIT_ITEMS_CACHE_ACTION = '[INIT_ROLE_ITEMS_CACHE]',
  RESET_STORE = '[RESET_ROLES_STORE]'
}

export const paginateRolesAction = (store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
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
              onRolePaginationDataLoaded(store)({
                data: (data as any[]).map((current) => deserializeSerializedRole(current)),
                total
              });
            } else {
              onRolePaginationDataLoaded(store)({ data: [], total: 0 });
            }
          }),
          catchError(err => {
            onErrorAction(store)(err);
            return emptyObservable();
          })
        )
    };
  });


export const onRolePaginationDataLoaded = (store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (payload: PaginationData<RoleV2>) => {
    return {
      type: RoleStoreActions.PAGINATION_DATA_ACTION,
      payload
    };
  });

export const createRoleAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.create(path, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              return roleCreatedAction(store)(deserializeSerializedRole(data));
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

export const roleCreatedAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (payload: RoleV2) =>
    ({ type: RoleStoreActions.CREATED_ROLE_ACTION, payload }));

export const updateRoleAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (client: IResourcesServerClient<any>, path: string, id: string | number, body: { [index: string]: any }) =>
    ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.updateUsingID(path, id, body)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              if (isObject(data)) {
                return roleUpdatedAction(store)({
                  item: deserializeSerializedRole(data),
                  updateResult: true
                });
              } else {
                return roleUpdatedAction(store)({ updateResult: true });
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

export const roleUpdatedAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: RoleStoreActions.ROLE_UPDATED_ACTION, payload }));



export const deleteRoleAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
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
                return roleDeletedAction(store)({
                  item: deserializeSerializedRole(data),
                  deleteResult: true
                });
              } else {
                return roleDeletedAction(store)({ deleteResult: true });
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

export const roleDeletedAction = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (payload: { [index: string]: any }) =>
    ({ type: RoleStoreActions.ROLE_DELETED_ACTION, payload }));

export const initialRolesState: RolesState = {
  items: {},
  pagination: {} as PaginationData<RoleV2>,
  performingAction: false,
  error: null,
};

export const resetRolesStore = (store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, () => {
    return {
      type: RoleStoreActions.RESET_STORE,
      payload: initialRolesState
    };
  });

export const getRoleUsingID = (
  store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) => {
  return createAction(store, (client: IResourcesServerClient<any>, path: string, id: string | number) => {
    return {
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.getUsingID(path, id)
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              return addToList(store)(deserializeSerializedRole(data));
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
};

export const addToList = (store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, (payload: RoleV2) => {
    return {
      type: RoleStoreActions.PUSH_ROLE_ACTION,
      payload
    };
  });

export const resetRolesCacheAction = (store: DrewlabsFluxStore<RolesState, Partial<StoreAction>>) =>
  createAction(store, () => {
    return {
      type: RoleStoreActions.INIT_ITEMS_CACHE_ACTION,
      payload: []
    };
  });
