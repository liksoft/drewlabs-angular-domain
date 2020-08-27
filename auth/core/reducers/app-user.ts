import { DefaultStoreAction, StoreAction } from '../../../rxjs/state/rx-state';
import { AppUsersState, AppUserStoreActions } from '../actions/app-users';
import * as lodash from 'lodash';

export const usersReducer = (state: AppUsersState, action: Partial<StoreAction>) => {
  let items = [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: [...action.payload],
        performingAction: false,
        error: null,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.INSERT_OR_UPDATE_ACTION:
      items = [...state.items];
      if (action.payload) {
        const user = items.findIndex(
          (i) => i.id === action.payload.id);
        items.splice(user, 1, action.payload);
      } else {
        items = [...items, action.payload];
      }
      return {
        ...state,
        items,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
        performingAction: false,
        error: null
      } as AppUsersState;
    case AppUserStoreActions.CONNECTED_USER_CHILDREN_ACTION:
      return {
        ...state,
        manageableUsers: [...action.payload],
        performingAction: false,
        error: null,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null,
        createdUser: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.ADD_USER_ACTION:
      return {
        ...state,
        items: [...state.items, ...(!lodash.isEmpty(action.payload) ? [action.payload] : [])],
        createdUser: action.payload,
        performingAction: false,
        error: null,
        updateResult: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.UPDATE_USER_ACTION:
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
        error: null,
        createdUser: null,
        deleteResult: null,
      } as AppUsersState;
    case AppUserStoreActions.DELETE_USER_ACTION:
      items = [...state.items];
      if (item) {
        lodash.remove(values, (v) => v.id === item.id);
      }
      return {
        ...state,
        items: [...values],
        performingAction: false,
        deleteResult,
        error: null,
        createdUser: null,
        updateResult: null,
      } as AppUsersState;
    default:
      return state;
  }
};

