import { DefaultStoreAction, StoreAction } from '../../../rxjs/state/rx-state';
import { RolesState, RoleStoreActions } from '../actions/roles';
import * as lodash from 'lodash';

export const rolesReducer = (state: RolesState, action: Partial<StoreAction>) => {
  let items = [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null
      } as RolesState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload
      } as RolesState;
    case RoleStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: [...action.payload],
        performingAction: false,
        error: null
      } as RolesState;
    case RoleStoreActions.PUSH_ROLE_ACTION:
      return {
        ...state,
        items: [...state.items, action.payload],
        performingAction: false,
        error: null
      } as RolesState;
    case RoleStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null
      } as RolesState;
    case RoleStoreActions.CREATED_ROLE_ACTION:
      return {
        ...state,
        items: [...state.items, ...(!lodash.isEmpty(action.payload) ? [action.payload] : [])],
        createdRole: action.payload,
        performingAction: false,
        error: null
      } as RolesState;
    case RoleStoreActions.ROLE_UPDATED_ACTION:
      const values = [...state.items];
      if (item) {
        values.splice
          (items.findIndex(
            (i) => i.id === item.id),
            1,
            action.payload
          );
      }
      return {
        ...state,
        items: [...values],
        performingAction: false,
        updateResult,
        error: null
      } as RolesState;
    case RoleStoreActions.ROLE_DELETED_ACTION:
      items = [...state.items];
      if (item) {
        lodash.remove(values, (v) => v.id === item.id);
      }
      return {
        ...state,
        items: [...values],
        performingAction: false,
        deleteResult,
        error: null
      } as RolesState;
    default:
      return state;
  }
};
