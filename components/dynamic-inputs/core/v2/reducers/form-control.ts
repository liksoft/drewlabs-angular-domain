import * as lodash from 'lodash';
import { FormControlState, FormControlStoreActions } from '../actions';
import { DefaultStoreAction, StoreAction } from '../../../../../rxjs/state/rx-state';


export const controlsReducer = (state: FormControlState, action: Partial<StoreAction>) => {
  let items = [];
  const { item, updateResult, deleteResult } = action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null
      } as FormControlState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload
      } as FormControlState; //
    case FormControlStoreActions.CREATED_FORM_CONTROL_ACTION:
      return {
        ...state,
        items: [...state.items, ...(!lodash.isEmpty(action.payload) ? [action.payload] : [])],
        createdControl: action.payload,
        performingAction: false,
        error: null
      } as FormControlState;
    case FormControlStoreActions.FORM_CONTROL_UPDATED_ACTION:
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
      } as FormControlState;
    case FormControlStoreActions.FORM_CONTROL_DELETED_ACTION:
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
      } as FormControlState;
    default:
      return state;
  }
};

