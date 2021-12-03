import { DefaultStoreAction, StoreAction } from "../../../rxjs/state/rx-state";
import { CompaniesStoreActions, CompaniesState } from "../actions/organisation";
import * as lodash from "lodash";
import { Company } from "../../contracts";

export const companiesReducer = (
  state: CompaniesState,
  action: Partial<StoreAction>
) => {
  let items: Company[] = [];
  const values = state.items ? [...state.items] : [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null,
      } as CompaniesState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
      } as CompaniesState;
    case CompaniesStoreActions.INIT_ITEMS_CACHE_ACTION:
      return {
        ...state,
        items: [...action.payload],
        performingAction: false,
        error: null,
      } as CompaniesState;
    case CompaniesStoreActions.PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null,
      } as CompaniesState;
    case CompaniesStoreActions.CREATED_COMPANY_ACTION:
      return {
        ...state,
        items: [
          ...state.items,
          ...(!lodash.isEmpty(action.payload) ? [action.payload] : []),
        ],
        createdCompany: action.payload,
        performingAction: false,
        error: null,
      } as CompaniesState;
    case CompaniesStoreActions.COMPANY_UPDATED_ACTION:
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
      } as CompaniesState;
    case CompaniesStoreActions.COMPANY_DELETED_ACTION:
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
      } as CompaniesState;
    default:
      return state;
  }
};
