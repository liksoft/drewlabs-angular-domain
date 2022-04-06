import { InputValidationRule } from './input-rules';
import { SelectableControl } from './select';

// @internal
/**
 * @deprecated use {@see InputRequireIfConfig}
 */
export interface HTMLFormControlRequireIfConfig extends InputRequireIfConfig {}

/**
 * @deprecated use {@see InputInterface}
 */
export interface IHTMLFormControl extends InputInterface {}

// @internal
export interface BindingControlInterface {
  serverBindings?: string;
  clientBindings?: string;
  groupfield: string;
  valuefield: string;
  keyfield: string;
  items: SelectableControl[];
}

/**
 * Abstract representation on an input for plarform specific
 * representation during build type
 *
 * **Note**
 * This interface is subject to change because the package is under active development
 */
export interface InputInterface {
  label: string;
  type: string;
  formControlName: string;
  classes: string;
  requiredIf?: InputRequireIfConfig;
  items?: any[];
  rules?: InputValidationRule;
  placeholder?: string;
  value?: string | any;
  disabled?: boolean;
  readOnly?: boolean;
  descriptionText?: string;
  formControlGroupKey?: string;
  formControlIndex?: number;
  hidden?: boolean;
  isRepeatable: boolean;
  uniqueCondition?: string;
  containerClass: string;
}

export interface InputRequireIfConfig {
  formControlName: string;
  values: any[];
}
