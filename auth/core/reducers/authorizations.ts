import { DefaultStoreAction, StoreAction } from "../../../rxjs/state/rx-state";
import {
  AuthorizationsState,
  AuthorizationsStoreActions,
} from "../actions/authorizations";
import { Authorization } from "../../contracts";
import { ArrayUtils, JSObject } from "../../../utils";

export const authorizationsReducer = (
  state: AuthorizationsState,
  action: Partial<StoreAction>
) => {
  let items: Authorization[] = [];
  let values = state.items ? [...state.items] : [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null,
      } as AuthorizationsState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
      } as AuthorizationsState;
    case AuthorizationsStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: [...action.payload],
        performingAction: false,
        error: null,
      } as AuthorizationsState;
    case AuthorizationsStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null,
      } as AuthorizationsState;
    case AuthorizationsStoreActions.CREATED_AUTHORIZATION_ACTION:
      return {
        ...state,
        items: [
          ...state.items,
          ...(!JSObject.isEmpty(action.payload) ? [action.payload] : []),
        ],
        createdAuthorization: action.payload,
        performingAction: false,
        error: null,
      } as AuthorizationsState;
    case AuthorizationsStoreActions.AUTHORIZATION_UPDATED_ACTION:
      if (item) {
        values.splice(
          items.findIndex((i) => i.id === item.id),
          1,
          action.payload
        );
      }
      return {
        ...state,
        items: [...values],
        performingAction: false,
        updateResult,
        error: null,
      } as AuthorizationsState;
    case AuthorizationsStoreActions.AUTHORIZATION_DELETED_ACTION:
      items = [...state.items];
      if (item) {
        values = ArrayUtils.reject(values, (v) => v.id === item.id);
      }
      return {
        ...state,
        items: [...values],
        performingAction: false,
        deleteResult,
        error: null,
      } as AuthorizationsState;
    default:
      return state;
  }
};
