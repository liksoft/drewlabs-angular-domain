import { IHTMLFormControlValidationRule } from './input-rules';

/**
 * @description Base interface definition for an HTML form control configuration values
 */
export interface IHTMLFormControl {
  label: string;
  type: string;
  formControlName: string;
  classes: string;
  items?: Array<any>;
  rules?: IHTMLFormControlValidationRule;
  placeholder?: string;
  value?: string|any;
  disabled?: boolean;
  readOnly?: boolean;
  descriptionText?: string;
  formControlGroupKey?: string;
  formControlGroupIndex?: number;
}
