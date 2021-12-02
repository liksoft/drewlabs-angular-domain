import * as lodash from "lodash";
import { FormState, FormStoreActions } from "../actions";
import {
  DefaultStoreAction,
  StoreAction,
} from "../../../../../rxjs/state/rx-state";
import {
  deleteFromListUsingID,
  updateListUsingID,
} from "../../../../../rxjs/helpers";
import {
  addPaginableValue,
  deletePaginableValue,
  mapPaginableTo,
  Paginable,
  updatePaginableValue,
} from "../../../../../pagination";
import { ControlInterface, FormInterface } from "../../compact";

const updateControls =
  (control: ControlInterface) => (state: Paginable<FormInterface>) => {
    let value =
      control && control.formId ? state.items[control.formId] : undefined;
    if (value) {
      return updatePaginableValue({
        ...value,
        controls: updateListUsingID(value.controls ?? [], control),
      })(state);
    }
    return state;
  };

const addControl =
  (control: ControlInterface) => (state: Paginable<FormInterface>) => {
    let value =
      control && control.formId ? state.items[control.formId] : undefined;
    if (value) {
      const controls = value.controls ?? [];
      return updatePaginableValue({
        ...value,
        controls: lodash.uniqBy([...controls, control], "id"),
      })(state);
    }
    return state;
  };

const deleteControl =
  (control: ControlInterface) => (state: Paginable<FormInterface>) => {
    if (control) {
      let value =
        control && control.formId ? state.items[control.formId] : undefined;
      if (value) {
        const controls = deleteFromListUsingID(value.controls ?? [], control);
        return updatePaginableValue({
          ...value,
          controls,
        })(state);
      }
    }
    return state;
  };

export const formsReducer = (
  state: FormState,
  action: Partial<StoreAction>
) => {
  const {
    updateResult,
    deleteResult,
    createResult,
    control,
    createControlResult,
    updateControlResult,
    deleteControlResult,
    value,
  } = action.payload ?? {};

  switch (action.type) {
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: null,
      } as FormState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
      } as FormState;
    case FormStoreActions.NEW_VALUE_ACTION:
      return {
        ...state,
        collections: addPaginableValue(action.payload)(state?.collections),
        performingAction: false,
        error: null,
      } as FormState;
    case FormStoreActions.FORM_PAGINATION_DATA_ACTION:
      return {
        ...state,
        collections: mapPaginableTo(action.payload)(state?.collections),
        performingAction: false,
        error: null,
      } as FormState;
    case FormStoreActions.CREATE_RESULT_ACTION:
      return {
        ...state,
        collections: addPaginableValue(value)(state?.collections),
        createResult,
        performingAction: false,
        error: null,
      } as FormState;
    case FormStoreActions.UPDATE_RESULT_ACTION:
      return {
        ...state,
        collections: updatePaginableValue(value)(state?.collections),
        performingAction: false,
        updateResult,
        error: null,
      } as FormState;
    case FormStoreActions.CONTROL_CREATE_RESULT_ACTION:
      return {
        ...state,
        collections: addControl(control)(state.collections),
        updateControlResult,
        createControlResult,
        performingAction: false,
        updateResult,
        createResult,
        error: null,
      } as FormState;
    case FormStoreActions.CONTROL_UPDATE_RESULT_ACTION:
      return {
        ...state,
        collections: updateControls(control)(state.collections),
        updateControlResult,
        createControlResult,
        performingAction: false,
        updateResult,
        createResult,
        error: null,
      } as FormState;
    case FormStoreActions.CONTROL_DELETE_RESULT_ACTION:
      return {
        ...state,
        collections: deleteControl(control)(state.collections),
        updateControlResult,
        createControlResult,
        deleteControlResult,
        performingAction: false,
        error: null,
      } as FormState;
    case FormStoreActions.DELETE_RESULT_ACTION:
      return {
        ...state,
        collections: deletePaginableValue(action.payload)(state.collections),
        performingAction: false,
        deleteResult,
        error: null,
      } as FormState;
    default:
      return state;
  }
};
