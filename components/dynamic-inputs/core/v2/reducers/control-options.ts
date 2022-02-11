import {
  DefaultStoreAction,
  StoreAction,
} from "../../../../../rxjs/state/rx-state";
import {
  insertOrUpdateValuesUsingID,
  removeItemFromCache,
} from "../../../../../rxjs/helpers";
import { OptionInterface } from "../../compact/types";
import { OptionsState, Actions } from "../actions/control-options";
import { Option } from "../models/form";

export const optionsReducer = (
  state: OptionsState,
  action: Partial<StoreAction>
) => {
  const { updateResult, deleteResult, createResult, value } =
    action.payload || {};
  switch (action.type) {
    case DefaultStoreAction.INITIALIZE_STORE_STATE:
      return action.payload;
    case DefaultStoreAction.ASYNC_UI_ACTION:
      return {
        ...state,
        performingAction: true,
        error: undefined,
        updateResult,
        deleteResult,
        createResult,
      } as OptionsState;
    case DefaultStoreAction.ERROR_ACTION:
      return {
        ...state,
        performingAction: false,
        error: action.payload,
        updateResult,
        deleteResult,
        createResult,
      } as OptionsState;
    case Actions.SELECTED:
      return {
        ...state,
        selected: action.payload,
        performingAction: false,
        error: undefined,
        updateResult,
        deleteResult,
        createResult,
      } as OptionsState;
    case Actions.CREATE_RESULT:
      return {
        ...state,
        collections: action.payload
          ? {
              ...(state.collections || {}),
              items: insertOrUpdateValuesUsingID(
                state.collections ? state.collections.items || {} : {},
                value
              ),
            }
          : { ...state.collections },
        createResult,
        updateResult,
        deleteResult,
        selected: undefined,
        performingAction: false,
        error: undefined,
      } as OptionsState;
    case Actions.UPDATE_RESULT:
      return {
        ...state,
        collections: action.payload
          ? {
              ...(state.collections || {}),
              items: insertOrUpdateValuesUsingID(
                state.collections ? state.collections.items || {} : {},
                value
              ),
            }
          : { ...state.collections },
        createResult,
        updateResult,
        deleteResult,
        selected: Option.builder().build(Option, {
          ...(state?.selected ? state?.selected : {}),
          ...value,
        }),
        performingAction: false,
        error: null,
      } as OptionsState;
    case Actions.DELETE_RESULT:
      return {
        ...state,
        collections: value
          ? {
              ...state.collections,
              items: removeItemFromCache(
                state.collections ? state.collections.items || {} : {},
                { id: value } as OptionInterface
              ),
            }
          : { ...state.collections },
        createResult,
        updateResult,
        deleteResult,
        selected: undefined,
        performingAction: false,
        error: null,
      } as OptionsState;
    default:
      return state;
  }
};
