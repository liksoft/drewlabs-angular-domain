export { AbstractHTMLFormControl } from "./types/dynamic-input";

// #region contracts definitions
export {
  IDynamicForm,
  IHTMLFormControlValidationRule,
  InputTypes,
  IHTMLFormControl,
} from "./contracts";
// #endregion contracts definitions

// #region input types definitions
export {
  TextInput,
  DateInput,
  CheckBoxInput,
  HiddenInput,
  NumberInput,
  PasswordInput,
  PhoneInput,
  RadioInput,
  SelectInput,
  TextAreaInput,
  FileInput,
  HMTLInput,
  InputGroup,
  DynamicForm,
} from "./types";
// #endregion input types definitions

export {
  CheckboxItem,
  ISelectItem,
  RadioItem,
  SelectSourceInterface,
} from "./contracts/control-item";

export {
  rebuildFormControlConfigs,
  sortRawFormControls,
  buildControl,
} from "./helpers";

export { STATIC_FORMS } from "./constants/forms";
