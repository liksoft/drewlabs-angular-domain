import { PaginationData } from "../../../pagination/types";
import { User } from "../../contracts/v2";
import {
  createAction,
  DrewlabsFluxStore,
  StoreAction,
  DefaultStoreAction,
  onErrorAction,
} from "../../../rxjs/state/rx-state";
import { IResourcesServerClient } from "../../../http/";
import { catchError, map } from "rxjs/operators";
import { getResponseDataFromHttpResponse } from "../../../http/helpers";
import { isArray, isDefined, isObject } from "../../../utils";
import { GenericUndecoratedSerializaleSerializer } from "../../../built-value/core/js/serializer";
import { emptyObservable } from "../../../rxjs/helpers";
import { HttpErrorResponse } from "@angular/common/http";

export const initialUsersState: AppUsersState = {
  items: {},
  manageableUsers: [],
  pagination: {} as PaginationData<User>,
  performingAction: false,
  error: null,
  updateResult: false,
  deleteResult: false,
};

export interface AppUsersState {
  performingAction?: boolean;
  error?: any;
  items: { [index: string]: User };
  pagination: PaginationData<User>;
  createdUser?: User;
  manageableUsers: User[];
  updateResult?: boolean;
  deleteResult?: boolean;
}

const deserializeSerializedUser = (serialized: any) => {
  return new GenericUndecoratedSerializaleSerializer().fromSerialized(
    User,
    serialized
  ) as User;
};

export enum AppUserStoreActions {
  UPDATE_USER_ACTION = "[UPDATE_USER]",
  DELETE_USER_ACTION = "[DELETE_USER]",
  ADD_USER_ACTION = "[ADD_USER_USER]",
  PAGINATION_DATA_ACTION = "[USERS_PAGINATION_DATA]",
  CONNECTED_USER_CHILDREN_ACTION = "[CONNECTED_USER_CHILDREN]",
  INIT_ITEMS_CACHE_ACTION = "[INIT_USERS_CACHE]",
  RESET_STORE = "[RESETTING_USERS_STORE]",
  INSERT_OR_UPDATE_ACTION = "[INSERT_OR_UPDATE]",
}

export const getUsersAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      params: { [index: string]: any } = {}
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.get(`${path}`, { params }).pipe(
        map((state) => {
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data) && isArray(data)) {
            usersDataAction(store)(
              (data as any[]).map((current) =>
                deserializeSerializedUser(current)
              )
            );
          }
        }),
        catchError((err) => {
          onErrorAction(store)(err);
          return emptyObservable();
        })
      ),
    })
  );

export const usersDataAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, (payload: User[]) => {
    return {
      type: AppUserStoreActions.INIT_ITEMS_CACHE_ACTION,
      payload,
    };
  });

export const getManageableUsersAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
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
              manageableUsersDataAction(store)(
                (data as any[]).map((current) =>
                  deserializeSerializedUser(current)
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

export const manageableUsersDataAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, (payload: User[]) => {
    return {
      type: AppUserStoreActions.CONNECTED_USER_CHILDREN_ACTION,
      payload,
    };
  });

export const createUserAction = (
  store: DrewlabsFluxStore<Partial<AppUsersState>, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      body: { [index: string]: any },
      params: { [index: string]: any } = {}
    ) => {
      return {
        type: DefaultStoreAction.ASYNC_UI_ACTION,
        payload: client.create(path, body, params).pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state) || {};
            // Parse and return the loaded data
            if (data) {
              return userCreatedAction(store)(deserializeSerializedUser(data));
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
      };
    }
  );

export const userCreatedAction = (
  store: DrewlabsFluxStore<Partial<AppUsersState>, Partial<StoreAction>>
) =>
  createAction(store, (payload: User) => ({
    type: AppUserStoreActions.ADD_USER_ACTION,
    payload,
  }));

export const updateUserAction = (
  store: DrewlabsFluxStore<Partial<AppUsersState>, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      id: number | string,
      body: { [index: string]: any }
    ) => {
      return {
        type: DefaultStoreAction.ASYNC_UI_ACTION,
        payload: client.updateUsingID(path, id, body).pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data) && isObject(data)) {
              return userUpdatedAction(store)({
                item: deserializeSerializedUser(data),
                updateResult: true,
              });
            } else if (data) {
              return userUpdatedAction(store)({ updateResult: true });
            }
            return emptyObservable();
            // Review the returned data in order to know how to parse it
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
      };
    }
  );

export const userUpdatedAction = (
  store: DrewlabsFluxStore<Partial<AppUsersState>, Partial<StoreAction>>
) =>
  createAction(store, (payload: User) => ({
    type: AppUserStoreActions.UPDATE_USER_ACTION,
    payload,
  }));

export const paginateAppUsers = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
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
        payload: client.get(path, { params }).pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const { data, total } =
              isDefined(state.data) && isDefined(state.data.data)
                ? state.data
                : state;
            if (isDefined(data) && isArray(data)) {
              onPaginationDataAction(store)({
                data: (data as any[]).map((current) =>
                  deserializeSerializedUser(current)
                ),
                total,
              });
            } else {
              onPaginationDataAction(store)({ data: [], total: 0 });
            }
          })
        ),
      };
    }
  );

export const onPaginationDataAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, (payload: PaginationData<User>) => ({
    type: AppUserStoreActions.PAGINATION_DATA_ACTION,
    payload,
  }));

export const deleteUserAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      id: number | string
    ) => {
      return {
        type: DefaultStoreAction.ASYNC_UI_ACTION,
        payload: client.deleteUsingID(path, id).pipe(
          map((state) => {
            const data = getResponseDataFromHttpResponse(state);
            if (isDefined(data)) {
              if (isObject(data)) {
                return userDeletedAction(store)({
                  item: deserializeSerializedUser(data),
                  deleteResult: true,
                });
              } else {
                return userDeletedAction(store)({ deleteResult: true });
              }
            }
            return emptyObservable();
          })
        ),
      };
    }
  );

export const userDeletedAction = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, (payload: any) => ({
    type: AppUserStoreActions.DELETE_USER_ACTION,
    payload,
  }));

export const resetUserStore = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, () => {
    return {
      type: AppUserStoreActions.RESET_STORE,
      payload: initialUsersState,
    };
  });

export const getUserUsingID = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      id: string | number
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.getUsingID(path, id).pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return addUserToList(store)(deserializeSerializedUser(data));
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

export const addUserToList = (
  store: DrewlabsFluxStore<AppUsersState, Partial<StoreAction>>
) =>
  createAction(store, (payload: AppUsersState) => {
    return {
      type: AppUserStoreActions.INSERT_OR_UPDATE_ACTION,
      payload,
    };
  });
