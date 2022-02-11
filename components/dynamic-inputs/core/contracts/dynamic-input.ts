import { SelectableControl } from "../v2";
import { IHTMLFormControlValidationRule } from "./input-rules";
export interface HTMLFormControlRequireIfConfig {
  formControlName: string;
  values: any[];
}

/**
 * @description Base interface definition for an HTML form control configuration values
 */
export interface IHTMLFormControl {
  label: string;
  type: string;
  formControlName: string;
  classes: string;
  requiredIf?: HTMLFormControlRequireIfConfig;
  items?: Array<any>;
  rules?: IHTMLFormControlValidationRule;
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

export interface BindingControlInterface {
  serverBindings?: string;
  clientBindings?: string;
  groupfield: string;
  valuefield: string;
  keyfield: string;
  items: SelectableControl[];
}
