import { catchError, map } from "rxjs/operators";
import { getResponseDataFromHttpResponse } from "../../../../../http/helpers";
import { UIStateStatusCode } from "../../../../../contracts/ui-state";
import { DrewlabsRessourceServerClient } from "../../../../../http/core";
import {
  createAction,
  DefaultStoreAction,
  DrewlabsFluxStore,
  onErrorAction,
  StoreAction,
} from "../../../../../rxjs/state/rx-state";
import { PaginationDataState } from "../../../../../rxjs/types";
import { OptionInterface } from "../../compact/types";
import { isDefined, isObject } from "../../../../../utils";
import { emptyObservable } from "../../../../../rxjs/helpers";
import { defaultHttpErrorHandler } from "../../../../../http/helpers/response";
import { createOptionElement } from "..";

export const deserializeOption = (serialized: { [index: string]: any }) => createOptionElement(serialized);

export const initialState: OptionsState = {
  collections: {
    page: 1,
    total: 0,
    items: {},
    data: [],
    lastPage: undefined,
    nextPageURL: undefined,
    lastPageURL: undefined,
  },
  selected: undefined,
  performingAction: false,
  error: null,
  createResult: undefined,
  updateResult: undefined,
  deleteResult: undefined,
};

/**
 * Control option state type definition
 */
export interface OptionsState {
  performingAction: boolean;
  collections: PaginationDataState<OptionInterface>;
  selected?: OptionInterface;
  createResult?: UIStateStatusCode;
  updateResult?: UIStateStatusCode;
  deleteResult?: UIStateStatusCode;
  error: any;
}

export enum Actions {
  SELECTED = "[CONTROL_OPTION_SELECTED]",
  CREATE_RESULT = "[CREATE_RESULT_ACTION]",
  UPDATE_RESULT = "[UPDATE_RESULT_ACTION]",
  DELETE_RESULT = "[DELETE_RESULT_ACTION]",
}

export const createControlOptionAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: DrewlabsRessourceServerClient,
      path: string,
      body: { [index: string]: any } = {},
      params: { [index: string]: any } = {}
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.create(`${path}`, body, params).pipe(
        map((state) => {
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return createControlResultAction(store)({
              createResult: UIStateStatusCode.STATUS_CREATED,
              value: deserializeOption(data),
            });
          }
          return emptyObservable();
        }),
        catchError((err) => {
          onErrorAction(store)(defaultHttpErrorHandler(client, err));
          return emptyObservable();
        })
      ),
    })
  );

export const createControlResultAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (payload: {
      createResult: UIStateStatusCode;
      value: OptionInterface;
    }) => ({
      type: Actions.CREATE_RESULT,
      payload,
    })
  );

export const updateControlOptionAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: DrewlabsRessourceServerClient,
      path: string,
      id: string | number,
      body: { [index: string]: any },
      params: { [index: string]: any } = {}
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.updateUsingID(path, id, body, params).pipe(
        map((state) => {
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return updateControlOptionResultAction(store)({
              updateResult: UIStateStatusCode.STATUS_OK,
              value: isObject(data) ? deserializeOption(data) : { id },
            });
          }
          return emptyObservable();
        }),
        catchError((err) => {
          onErrorAction(store)(defaultHttpErrorHandler(client, err));
          return emptyObservable();
        })
      ),
    })
  );
export const updateControlOptionResultAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (payload: {
      updateResult: UIStateStatusCode;
      value: OptionInterface | { id: string | number };
    }) => ({
      type: Actions.UPDATE_RESULT,
      payload,
    })
  );

export const selectControlOptionAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(store, (payload: OptionInterface) => ({
    type: Actions.SELECTED,
    payload,
  }));

export const deleteControlOptionAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (
      client: DrewlabsRessourceServerClient,
      path: string,
      id: string | number,
      params: { [index: string]: any } = {}
    ) => ({
      type: DefaultStoreAction.ASYNC_UI_ACTION,
      payload: client.deleteUsingID(path, id, params).pipe(
        map((state) => {
          const data = getResponseDataFromHttpResponse(state);
          if (isDefined(data)) {
            return updateControlOptionResultAction(store)({
              deleteResult: UIStateStatusCode.STATUS_OK,
              value: id,
            });
          }
          return emptyObservable();
        }),
        catchError((err) => {
          onErrorAction(store)(defaultHttpErrorHandler(client, err));
          return emptyObservable();
        })
      ),
    })
  );

export const deleteControlOptionResultAction = (
  store: DrewlabsFluxStore<OptionsState, Partial<StoreAction>>
) =>
  createAction(
    store,
    (payload: { deleteResult: UIStateStatusCode; value: string | number }) => ({
      type: Actions.DELETE_RESULT,
      payload,
    })
  );

export { initialState as OptionsInitialState };
