import { DefaultStoreAction, StoreAction } from "../../../rxjs/state/rx-state";
import { RolesState, RoleStoreActions } from "../actions/roles";
import * as lodash from "lodash";
import {
  addItemToCache,
  insertOrUpdateValuesUsingID,
  listItemToIdMaps,
  removeItemFromCache,
} from "../../../rxjs/helpers";

export const rolesReducer = (
  state: RolesState,
  action: Partial<StoreAction>
) => {
  const { updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: undefined,
      } as RolesState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
      } as RolesState;
    case RoleStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: listItemToIdMaps(action.payload),
        performingAction: false,
        error: undefined,
      } as RolesState;
    case RoleStoreActions.PUSH_ROLE_ACTION:
      return {
        ...state,
        items: addItemToCache(
          state.items,
          !lodash.isEmpty(action.payload) ? action.payload : {}
        ),
        performingAction: false,
        error: undefined,
      } as RolesState;
    case RoleStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: undefined,
      } as RolesState;
    case RoleStoreActions.CREATED_ROLE_ACTION:
      return {
        ...state,
        items: insertOrUpdateValuesUsingID(state.items, action.payload),
        createdRole: action.payload,
        performingAction: false,
        error: undefined,
      } as RolesState;
    case RoleStoreActions.ROLE_UPDATED_ACTION:
      return {
        ...state,
        items: insertOrUpdateValuesUsingID(state.items, action.payload),
        performingAction: false,
        updateResult,
        error: undefined,
      } as RolesState;
    case RoleStoreActions.ROLE_DELETED_ACTION:
      return {
        ...state,
        items: removeItemFromCache(state.items, action.payload),
        performingAction: false,
        deleteResult,
        error: undefined,
      } as RolesState;
    default:
      return state;
  }
};
