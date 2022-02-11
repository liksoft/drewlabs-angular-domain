import { PaginationData } from "../../../pagination/types";
import {
  createAction,
  DefaultStoreAction,
  DrewlabsFluxStore,
  onErrorAction,
  StoreAction,
} from "../../../rxjs/state/rx-state";
import { catchError, map } from "rxjs/operators";
import { isArray, isDefined, isObject } from "../../../utils";
import { GenericUndecoratedSerializaleSerializer } from "../../../built-value/core/js/serializer";
import { emptyObservable } from "../../../rxjs/helpers";
import { HttpErrorResponse } from "@angular/common/http";
import { Authorization } from "../../contracts/v2/authorizations/authorization";
import { getResponseDataFromHttpResponse } from "../../../http/helpers/response";
import { IResourcesServerClient } from "../../../http";

export interface AuthorizationsState {
  performingAction: boolean;
  items: Authorization[];
  pagination: PaginationData<Authorization>;
  createdAuthorization?: Authorization;
  updateResult?: boolean;
  deleteResult?: boolean;
  error?: any;
}

const deserializeSerializedAuthorization = (serialized: any) => {
  return new GenericUndecoratedSerializaleSerializer().fromSerialized(
    Authorization,
    serialized
  ) as Authorization;
};

export enum AuthorizationsStoreActions {
  PAGINATION_DATA_ACTION = "[AUTHORIZATION_PAGINATION_DATA]",
  CREATED_AUTHORIZATION_ACTION = "[CREATED_AUTHORIZATION]",
  INIT_ITEMS_CACHE_ACTION = "[INIT_AUTHORIZATIONS_CACHE]",
  AUTHORIZATION_UPDATED_ACTION = "[AUTHORIZATION_UPDATED]",
  AUTHORIZATION_DELETED_ACTION = "[AUTHORIZATION_DELETED]",
  RESET_STORE = "[RESET_AUTHORIZATIONS_STORE]",
}

export const getAuthorizationAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      params: { [index: string]: any } = {}
    ) => {
      return {
        type: DefaultStoreAction.ASYNC_UI_ACTION,
        payload: client.get(`${path}`, { params }).pipe(
          map((state) => {
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data) && isArray(data)) {
              authorizationsDataAction(store)(
                (data as any[]).map((current) =>
                  deserializeSerializedAuthorization(current)
                )
              );
            }
          }),
          catchError((err) => {
            onErrorAction(store)(err);
            return emptyObservable();
          })
        ),
      };
    }
  );

export const authorizationsDataAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Authorization[]) => {
    return {
      type: AuthorizationsStoreActions.INIT_ITEMS_CACHE_ACTION,
      payload,
    };
  });

export const onPaginateAuthorizationAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      params: { [index: string]: any } = {}
    ) => {
      return {
        type: DefaultStoreAction.ASYNC_UI_ACTION,
        payload: client.get(`${path}`, { params }).pipe(
          map((state) => {
            const { data, total } =
              isDefined(state.data) && isDefined(state.data.data)
                ? state.data
                : state;
            if (isDefined(data) && isArray(data)) {
              onAuthorizationPaginationDataLoaded(store)({
                data: (data as any[]).map((current) =>
                  deserializeSerializedAuthorization(current)
                ),
                total,
              });
            } else {
              onAuthorizationPaginationDataLoaded(store)({
                data: [],
                total: 0,
              });
            }
          }),
          catchError((err) => {
            onErrorAction(store)(err);
            return emptyObservable();
          })
        ),
      };
    }
  );

export const onAuthorizationPaginationDataLoaded = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: PaginationData<Authorization>) => {
    return {
      type: AuthorizationsStoreActions.PAGINATION_DATA_ACTION,
      payload,
    };
  });

export const createAuthorizationAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      body: { [index: string]: any }
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.create(path, body).pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return authorizationCreated(store)(
              deserializeSerializedAuthorization(data)
            );
          }
          return emptyObservable();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const authorizationCreated = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Authorization) => ({
    type: AuthorizationsStoreActions.CREATED_AUTHORIZATION_ACTION,
    payload,
  }));

export const updateAuthorizationAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      body: { [index: string]: any }
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.update(path, body).pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            if (isObject(data)) {
              return authorizationUpdatedAction(store)({
                item: deserializeSerializedAuthorization(data),
                updateResult: true,
              });
            } else {
              return authorizationUpdatedAction(store)({ updateResult: true });
            }
          }
          return emptyObservable();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const authorizationUpdatedAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: AuthorizationsStoreActions.AUTHORIZATION_UPDATED_ACTION,
    payload,
  }));

export const deleteAuthorizationAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      id: number | string
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.deleteUsingID(path, id).pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            if (isObject(data)) {
              return authorizationDeletedAction(store)({
                item: deserializeSerializedAuthorization(data),
                deleteResult: true,
              });
            } else {
              return authorizationDeletedAction(store)({ deleteResult: true });
            }
          }
          return emptyObservable();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const authorizationDeletedAction = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: AuthorizationsStoreActions.AUTHORIZATION_DELETED_ACTION,
    payload,
  }));

export const initialAuthorizationsState: AuthorizationsState = {
  items: [],
  pagination: {} as PaginationData<Authorization>,
  performingAction: false,
};

export const resetAuthorizationsStore = (
  store: DrewlabsFluxStore<AuthorizationsState, Partial<StoreAction>>
) =>
  createAction(store, () => {
    return {
      type: AuthorizationsStoreActions.RESET_STORE,
      payload: initialAuthorizationsState,
    };
  });
