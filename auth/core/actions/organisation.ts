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
import { Company } from "../../contracts/v2/company/company";
import { getResponseDataFromHttpResponse } from "../../../http/helpers/response";
import { IResourcesServerClient } from "../../../http";

export interface CompaniesState {
  performingAction: boolean;
  items: Company[];
  pagination: PaginationData<Company>;
  createdCompany?: Company;
  updateResult?: boolean;
  deleteResult?: boolean;
  error?: any;
}

const deserializeSerializedCompany = (serialized: any) => {
  return new GenericUndecoratedSerializaleSerializer().fromSerialized(
    Company,
    serialized
  ) as Company;
};

export enum CompaniesStoreActions {
  PAGINATION_DATA_ACTION = "[COMPANY_PAGINATION_DATA]",
  CREATED_COMPANY_ACTION = "[CREATED_COMPANY]",
  INIT_ITEMS_CACHE_ACTION = "[INIT_COMPANIES_CACHE]",
  COMPANY_UPDATED_ACTION = "[COMPANY_UPDATED]",
  COMPANY_DELETED_ACTION = "[COMPANY_DELETED]",
  RESET_STORE = "[RESETTING_COMPANIES_STORE]",
}

export const getCompanyAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
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
              companiesDataAction(store)(
                (data as any[]).map((current) =>
                  deserializeSerializedCompany(current)
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

export const companiesDataAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Company[]) => {
    return {
      type: CompaniesStoreActions.INIT_ITEMS_CACHE_ACTION,
      payload,
    };
  });

export const onPaginateCompanyAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
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
              onCompanyPaginationDataLoaded(store)({
                data: (data as any[]).map((current) =>
                  deserializeSerializedCompany(current)
                ),
                total,
              });
            } else {
              onCompanyPaginationDataLoaded(store)({ data: [], total: 0 });
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

export const onCompanyPaginationDataLoaded = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, (payload: PaginationData<Company>) => {
    return {
      type: CompaniesStoreActions.PAGINATION_DATA_ACTION,
      payload,
    };
  });

export const createCompanyAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
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
            return companyCreated(store)(deserializeSerializedCompany(data));
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

export const companyCreated = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Company) => ({
    type: CompaniesStoreActions.CREATED_COMPANY_ACTION,
    payload,
  }));

export const updateCompanyAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
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
              return companyUpdatedAction(store)({
                item: deserializeSerializedCompany(data),
                updateResult: true,
              });
            } else {
              return companyUpdatedAction(store)({ updateResult: true });
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

export const companyUpdatedAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: CompaniesStoreActions.COMPANY_UPDATED_ACTION,
    payload,
  }));

export const deleteCompanyAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
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
              return companyDeletedAction(store)({
                item: deserializeSerializedCompany(data),
                deleteResult: true,
              });
            } else {
              return companyDeletedAction(store)({ deleteResult: true });
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

export const companyDeletedAction = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: CompaniesStoreActions.COMPANY_DELETED_ACTION,
    payload,
  }));

export const initialCompaniesState: CompaniesState = {
  items: [],
  pagination: {} as PaginationData<Company>,
  performingAction: false,
};

export const resetCompaniesStore = (
  store: DrewlabsFluxStore<CompaniesState, Partial<StoreAction>>
) =>
  createAction(store, () => {
    return {
      type: CompaniesStoreActions.RESET_STORE,
      payload: initialCompaniesState,
    };
  });
