import { DefaultStoreAction, StoreAction } from "../../../rxjs/state/rx-state";
import {
  DepartmentV2sStoreActions,
  DepartmentV2sState,
} from "../actions/department";
import * as lodash from "lodash";
import { DepartmentV2 } from "../../contracts";

export const departmentsReducer = (
  state: DepartmentV2sState,
  action: Partial<StoreAction>
) => {
  let items: DepartmentV2[] = [];
  const values = state.items ? [...state.items] : [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null,
      } as DepartmentV2sState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: [...action.payload],
        performingAction: false,
        error: null,
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null,
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.INSERT_OR_UPDATE_ACTION:
      items = [...state.items];
      if (action.payload) {
        const department = items.findIndex((i) => i.id === action.payload.id);
        items.splice(department, 1, action.payload);
      } else {
        items = [...items, action.payload];
      }
      return {
        ...state,
        items,
        selected: action.payload,
        createdDepartment: undefined,
        updateResult: undefined,
        deleteResult: undefined,
        performingAction: false,
        error: null,
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.CREATED_DEPARTMENT_ACTION:
      return {
        ...state,
        items: [
          ...state.items,
          ...(!lodash.isEmpty(action.payload) ? [action.payload] : []),
        ],
        createdDepartment: action.payload,
        performingAction: false,
        error: null,
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.DEPARTMENT_UPDATED_ACTION:
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
      } as DepartmentV2sState;
    case DepartmentV2sStoreActions.DEPARTMENT_DELETED_ACTION:
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
      } as DepartmentV2sState;
    default:
      return state;
  }
};
