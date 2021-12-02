import { Form } from "../models/form";
import {
  createAction,
  DefaultStoreAction,
  DrewlabsFluxStore,
  onErrorAction,
  StoreAction,
} from "../../../../../rxjs/state/rx-state";
import { catchError, map } from "rxjs/operators";
import { getResponseDataFromHttpResponse } from "../../../../../http/helpers/response";
import { emptyObservable } from "../../../../../rxjs/helpers";
import { GenericUndecoratedSerializaleSerializer } from "../../../../../built-value/core/js/serializer";
import { HttpErrorResponse } from "@angular/common/http";
import { ControlInterface, FormInterface } from "../../compact";
import { Control } from "../models";
import { UIStateStatusCode } from "../../../../../contracts/ui-state";
import { IResourcesServerClient } from "../../../../../http";
import { Paginable } from "../../../../../pagination";
import { isObject } from "../../../../../utils";

export interface FormState {
  performingAction: boolean;
  collections: Paginable<FormInterface>;
  selectedFormId?: number;
  currentForm?: FormInterface;
  createResult?: UIStateStatusCode;
  updateResult?: UIStateStatusCode;
  deleteResult?: UIStateStatusCode;
  createControlResult?: UIStateStatusCode;
  updateControlResult?: UIStateStatusCode;
  deleteControlResult?: UIStateStatusCode;
  error?: any;
}

export enum FormStoreActions {
  FORM_SELECTED_ACTION = "[FORM_SELECTED]",
  CREATE_ACTION = "[CREATE]",
  UPDATE_ACTION = "[UPDATE]",
  FORM_PAGINATION_DATA_ACTION = "[FORM_PAGINATION_DATA]",
  CREATE_RESULT_ACTION = "[CREATED_FORM]",
  NEW_VALUE_ACTION = "[ADD_TO_FORMS_STACK]",
  UPDATE_RESULT_ACTION = "[FORM_UPDATED]",
  DELETE_RESULT_ACTION = "[FORM_DELETED]",
  CREATE_CONTROL_ACTION = "[CREATE_CONTROL]",
  UPDATE_CONTROL_ACTION = "[UPDATE_CONTROL]",
  DELETE_CONTROL_ACTION = "[DELETE_CONTROL]",
  DELETE_FORM_CONTROL_ACTION = "[DELETE_FORM_CONTROL]",
  CONTROL_CREATE_RESULT_ACTION = "[FORM_CONTROL_CREATED]",
  CONTROL_UPDATE_RESULT_ACTION = "[FORM_CONTROL_UPDATED]",
  CONTROL_DELETE_RESULT_ACTION = "[FORM_CONTROL_REMOVED]",
}

export const onPaginateFormsAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
              state.data && state.data?.data ? state.data : state;
            if (Array.isArray(data)) {
              onFormPaginationDataLoaded(store)({
                data: (data as any[]).map(
                  (current) =>
                    new GenericUndecoratedSerializaleSerializer().fromSerialized(
                      Form,
                      current
                    ) as Form
                ),
                total,
              });
            } else {
              onFormPaginationDataLoaded(store)({ data: [], total: 0 });
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

export const onFormPaginationDataLoaded = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Paginable<Form>) => {
    return {
      type: FormStoreActions.FORM_PAGINATION_DATA_ACTION,
      payload,
    };
  });

export const createFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
          if (data) {
            return formCreatedAction(store)({
              value:
                new GenericUndecoratedSerializaleSerializer().fromSerialized(
                  Form,
                  data
                ) as Form,
              createResult: UIStateStatusCode.OK,
            });
          }
          return emptyObservable();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formCreatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Form) => ({
    type: FormStoreActions.CREATE_RESULT_ACTION,
    payload,
  }));

export const loadFormUsingIDAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      id: string | number,
      params: { [prop: string]: any } = { load_bindings: true }
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client
        .getUsingID(path, id, { params: params || { load_bindings: true } })
        .pipe(
          map((state) => {
            // tslint:disable-next-line: one-variable-per-declaration
            const data = getResponseDataFromHttpResponse(state);
            if (data) {
              return onNewFormAction(store)(
                new GenericUndecoratedSerializaleSerializer().fromSerialized(
                  Form,
                  data
                ) as Form
              );
            }
            return emptyObservable();
          }),
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              const errorResponse = client.handleErrorResponse(err);
              onErrorAction(store)(errorResponse);
            } else {
              onErrorAction(store)(err);
            }
            return emptyObservable();
          })
        ),
    })
  );

export const onNewFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) => {
  return createAction(store, (payload: Form[] | Form) => ({
    type: FormStoreActions.NEW_VALUE_ACTION,
    payload,
  }));
};

export const updateFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
          if (data && typeof data === "object" && !Array.isArray(data)) {
            return formUpdatedAction(store)({
              value:
                new GenericUndecoratedSerializaleSerializer().fromSerialized(
                  Form,
                  data
                ) as Form,
              updateResult: UIStateStatusCode.OK,
            });
          } else {
            return formUpdatedAction(store)({
              updateResult: UIStateStatusCode.OK,
            });
          }
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formUpdatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: FormStoreActions.UPDATE_RESULT_ACTION,
    payload,
  }));

export const deleteFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
          return formDeletedAction(store)({
            item: isObject(data) ? data : { id },
            deleteResult: UIStateStatusCode.OK,
          });
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formDeletedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: FormStoreActions.DELETE_RESULT_ACTION,
    payload,
  }));

export const selectFormAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: number | string) => ({
    type: FormStoreActions.FORM_SELECTED_ACTION,
    payload,
  }));

export const createFormControlAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
          if (data) {
            return formControlCreatedAction(store)({
              control:
                new GenericUndecoratedSerializaleSerializer().fromSerialized(
                  Control,
                  data
                ) as Control,
              createControlResult: UIStateStatusCode.OK,
            });
          }
          return emptyObservable();
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formControlCreatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: Control) => ({
    type: FormStoreActions.CONTROL_CREATE_RESULT_ACTION,
    payload,
  }));

export const updateFormControlAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
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
          if (data && typeof data === "object" && !Array.isArray(data)) {
            return formControlUpdatedAction(store)({
              control:
                new GenericUndecoratedSerializaleSerializer().fromSerialized(
                  Control,
                  data
                ) as Control,
              updateControlResult: UIStateStatusCode.OK,
            });
          } else {
            return formControlUpdatedAction(store)({
              updateControlResult: UIStateStatusCode.OK,
            });
          }
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formControlUpdatedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: FormStoreActions.CONTROL_UPDATE_RESULT_ACTION,
    payload,
  }));

export const deleteFormFormControl = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: IResourcesServerClient<any>,
      path: string,
      params: { [prop: string]: any } = {},
      id?: number
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.delete(path, { params: params ?? {} }).pipe(
        map((state) => {
          // tslint:disable-next-line: one-variable-per-declaration
          if (id) {
            formControlRemovedAction(store)({
              deleteControlResult: UIStateStatusCode.OK,
              control: {
                id: id,
                formId: params?.form_id,
              } as Partial<ControlInterface>,
            });
          }
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = client.handleErrorResponse(err);
            onErrorAction(store)(errorResponse);
          } else {
            onErrorAction(store)(err);
          }
          return emptyObservable();
        })
      ),
    })
  );

export const formControlRemovedAction = (
  store: DrewlabsFluxStore<FormState, Partial<StoreAction>>
) =>
  createAction(store, (payload: { [index: string]: any }) => ({
    type: FormStoreActions.CONTROL_DELETE_RESULT_ACTION,
    payload,
  }));
