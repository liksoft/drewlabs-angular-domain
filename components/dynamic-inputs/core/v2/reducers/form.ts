import * as lodash from 'lodash';
import { FormState, FormStoreActions } from '../actions';
import { DefaultStoreAction, StoreAction } from '../../../../../rxjs/state/rx-state';
import { isArray } from '../../../../../utils/types/type-utils';

export const formsReducer = (state: FormState, action: Partial<StoreAction>) => {
  let items = [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null
      } as FormState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload
      } as FormState; //
    case FormStoreActions.FORM_SELECTED_ACTION:
      return {
        ...state,
        performingAction: false,
        error: null,
        selectedFormId: action.payload
      } as FormState;
    case FormStoreActions.ADD_TO_FORMS_STACK_ACTION:
      items = isArray(action.payload) ? [...state.items, ...action.payload] : [...state.items, action.payload];
      return {
        ...state,
        items: lodash.uniqBy(items, 'id'),
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.FORM_PAGINATION_DATA_ACTION:
      return {
        ...state,
        pagination: action.payload,
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.CREATED_FORM_ACTION:
      return {
        ...state,
        items: [...state.items, ...(!lodash.isEmpty(action.payload) ? [action.payload] : [])],
        createdForm: action.payload,
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.FORM_UPDATED_ACTION:
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
      } as FormState;
    case FormStoreActions.FORM_UPDATED_ACTION:
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
      } as FormState;
    default:
      return state;
  }
};

