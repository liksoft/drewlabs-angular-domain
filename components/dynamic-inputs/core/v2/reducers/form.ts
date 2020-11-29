import * as lodash from 'lodash';
import { FormState, FormStoreActions } from '../actions';
import { DefaultStoreAction, StoreAction } from '../../../../../rxjs/state/rx-state';
import { insertOrUpdateValuesUsingID, removeItemFromCache, updatePaginationData } from 'src/app/lib/domain/rxjs/helpers';
import { DynamicFormInterface } from '../../compact/types';
import { deleteFromListUsingID, updateListUsingID } from 'src/app/lib/domain/rxjs/helpers/entity-handlers';

export const formsReducer = (state: FormState, action: Partial<StoreAction>) => {
  const {
    updateResult,
    deleteResult,
    currentForm,
    createResult,
    control,
    createControlResult,
    updateControlResult,
    deleteControlResult
  } = action.payload || {};
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
      } as FormState;
    case FormStoreActions.NEW_VALUE_ACTION:
      return {
        ...state,
        collections: action.payload ? {
          ...(state.collections || {}),
          items: insertOrUpdateValuesUsingID(
            state.collections ? (state.collections.items || {}) : {}, action.payload
          )
        } : { ...state.collections },
        currentForm: action.payload,
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.FORM_PAGINATION_DATA_ACTION:
      return {
        ...state,
        collections: updatePaginationData<DynamicFormInterface>(state.collections, action.payload),
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.CREATE_RESULT_ACTION:
      return {
        ...state,
        collections: currentForm ? {
          ...state.collections,
          items: insertOrUpdateValuesUsingID(
            state.collections ? (state.collections.items || {}) : {}, currentForm
          )
        } : { ...state.collections },
        currentForm: currentForm || state.currentForm,
        createResult,
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.UPDATE_RESULT_ACTION:
      return {
        ...state,
        collections: currentForm ? {
          ...state.collections, items: insertOrUpdateValuesUsingID(
            state.collections ? (state.collections.items || {}) : {}, currentForm
          )
        } : { ...state.collections },
        currentForm: currentForm || state.currentForm,
        performingAction: false,
        updateResult,
        error: null
      } as FormState;
    case FormStoreActions.CONTROL_CREATE_RESULT_ACTION:
      return {
        ...state,
        currentForm: (state.currentForm && control) ? {
          ...state.currentForm,
          formControls: state.currentForm ?
            lodash.uniqBy([...(state.currentForm.formControls || []), control], 'id') :
            [...(state.currentForm.formControls || [])]
        } : state.currentForm,
        updateControlResult,
        createControlResult,
        performingAction: false,
        updateResult,
        createResult,
        error: null
      } as FormState;
    case FormStoreActions.CONTROL_UPDATE_RESULT_ACTION:
      return {
        ...state,
        currentForm: (state.currentForm && control) ? {
          ...state.currentForm,
          formControls: state.currentForm ?
            updateListUsingID(state.currentForm.formControls || [], control) :
            [...(state.currentForm.formControls || [])]
        } : state.currentForm,
        updateControlResult,
        createControlResult,
        performingAction: false,
        updateResult,
        createResult,
        error: null
      } as FormState;
    case FormStoreActions.CONTROL_DELETE_RESULT_ACTION:
      return {
        ...state,
        currentForm: (state.currentForm && control) ? {
          ...state.currentForm,
          formControls: state.currentForm ?
            deleteFromListUsingID(state.currentForm.formControls || [], control) :
            [...(state.currentForm.formControls || [])]
        } : state.currentForm,
        updateControlResult,
        createControlResult,
        deleteControlResult,
        performingAction: false,
        error: null
      } as FormState;
    case FormStoreActions.DELETE_RESULT_ACTION:
      return {
        ...state,
        collections: currentForm ? {
          ...state.collections,
          items: removeItemFromCache(
            state.collections ? (state.collections.items || {}) : {}, currentForm
          )
        } : { ...state.collections },
        performingAction: false,
        deleteResult,
        error: null
      } as FormState;
    default:
      return state;
  }
};

