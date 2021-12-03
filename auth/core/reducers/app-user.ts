import { DefaultStoreAction, StoreAction } from '../../../rxjs/state/rx-state';
import { AppUsersState, AppUserStoreActions } from '../actions/app-users';
import * as lodash from 'lodash';
import { addItemToCache, insertOrUpdateValuesUsingID, listItemToIdMaps, removeItemFromCache } from '../../../rxjs/helpers';

export const usersReducer = (state: AppUsersState, action: Partial<StoreAction>) => {
  const { updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: undefined,
        createdUser: undefined,
        updateResult: false,
        deleteResult: false,
      } as AppUsersState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
        createdUser: undefined,
        updateResult: undefined,
        deleteResult: undefined,
      } as AppUsersState;
    case AppUserStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: listItemToIdMaps(action.payload),
        performingAction: false,
        error: undefined,
        createdUser: undefined,
        updateResult: undefined,
        deleteResult: undefined,
      } as AppUsersState;
    case AppUserStoreActions.INSERT_OR_UPDATE_ACTION:
      return {
        ...state,
        items: insertOrUpdateValuesUsingID(state.items, action.payload),
        createdUser: undefined,
        updateResult: undefined,
        deleteResult: undefined,
        performingAction: false,
        error: null
      } as AppUsersState;
    case AppUserStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: undefined,
        createdUser: undefined,
        updateResult: undefined,
        deleteResult: undefined,
      } as AppUsersState;
    case AppUserStoreActions.ADD_USER_ACTION:
      return {
        ...state,
        items: addItemToCache(state.items, !lodash.isEmpty(action.payload) ? action.payload : {}),
        createdUser: action.payload,
        performingAction: false,
        error: undefined,
        updateResult: undefined,
        deleteResult: undefined,
      } as AppUsersState;
    case AppUserStoreActions.UPDATE_USER_ACTION:
      return {
        ...state,
        items: insertOrUpdateValuesUsingID(state.items, action.payload),
        performingAction: false,
        updateResult,
        error: undefined,
        createdUser: undefined,
        deleteResult: undefined,
      } as AppUsersState;
    case AppUserStoreActions.DELETE_USER_ACTION:
      return {
        ...state,
        items: removeItemFromCache(state.items, action.payload),
        performingAction: false,
        deleteResult,
        error: undefined,
        createdUser: undefined,
        updateResult: undefined,
      } as AppUsersState;
    default:
      return state;
  }
};
