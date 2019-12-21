import { IHTMLFormControl } from './contracts/dynamic-input-interface';
import { IHTMLFormControlValidationRule } from './contracts/input-rules';
import { FormControlModel } from './contracts/form-control';

export abstract class AbstractHTMLFormControl implements IHTMLFormControl {
  label: string;
  type: string;
  formControlName: string;
  classes: string;
  rules: IHTMLFormControlValidationRule;
  placeholder?: string;
  items?: Array<any>;
  value?: any;
  descriptionText?: string;
  disabled: boolean;
  readOnly: boolean;
  formControlGroupIndex?: number;
  formControlGroupKey?: string;
  /**
   * @description Instance initializer
   * @param param Required input configuration object
   */
  constructor(param: IHTMLFormControl) {
    this.label = param.label;
    this.type = param.type;
    this.formControlName = param.formControlName;
    this.classes = param.classes;
    this.rules = param.rules ?  param.rules : {} as IHTMLFormControlValidationRule;
    this.placeholder = param.placeholder;
    this.descriptionText = param.descriptionText;
    this.items = param.items;
    this.disabled = param.disabled ? param.disabled : false;
    this.readOnly = param.readOnly ? param.readOnly : false;
    this.value = param.value ? param.value : null;
    this.formControlGroupIndex = param.formControlGroupIndex ? param.formControlGroupIndex : null;
    this.formControlGroupKey = param.formControlGroupKey ? param.formControlGroupKey : null;
  }
}
