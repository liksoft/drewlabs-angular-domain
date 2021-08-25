import { isArray, isDefined } from "../../../../utils/types";

import { IDynamicForm } from "../contracts/dynamic-form";

export {
  DynamicFormHelpers,
  sortFormByIndex,
  sortDynamicFormByIndex,
  cloneDynamicForm,
  createDynamicForm,
  sortFormFormControlsByIndex,
} from "./dynamic-form-helpers";

export {
  buildRequiredIfConfig,
  buildCheckboxItems,
  buildSelectItems,
  buildRadioInputItems,
} from "./builders";

export { parseControlItemsConfigs } from "./parsers";
export { controlBindingsSetter } from "./control-bindings";
export { rebuildFormControlConfigs } from "./form-control-configs";

/**
 * @description Checks if a dynamic form contains other form
 * @deprecated
 * @param f
 */
export const isGroupOfIDynamicForm = (value?: IDynamicForm) =>
  isDefined(value) && isArray(value?.forms || undefined) ? true : false;
