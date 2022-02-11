import { ControlInterface } from '../compact/types';
import { IHTMLFormControl, HTMLFormControlRequireIfConfig } from '../contracts/dynamic-input';
import { IHTMLFormControlValidationRule } from '../contracts/input-rules';

export abstract class AbstractHTMLFormControl implements IHTMLFormControl {
  label: string;
  type: string;
  formControlName: string;
  classes: string;
  requiredIf?: HTMLFormControlRequireIfConfig;
  rules: IHTMLFormControlValidationRule;
  placeholder?: string;
  items?: Array<any>;
  value?: any;
  descriptionText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  formControlIndex?: number;
  formControlGroupKey?: string;
  hidden?: boolean;
  isRepeatable: boolean;
  uniqueCondition?: string;
  containerClass: string;

  /**
   * @description Instance initializer
   * @param param Required input configuration object
   */
  constructor(param: IHTMLFormControl) {
    this.label = param.label;
    this.type = param.type;
    this.formControlName = param.formControlName;
    this.classes = param.classes;
    this.rules = param.rules ? param.rules : {} as IHTMLFormControlValidationRule;
    this.placeholder = param.placeholder;
    this.descriptionText = param.descriptionText;
    this.items = param.items;
    this.disabled = param.disabled ? param.disabled : false;
    this.readOnly = param.readOnly ? param.readOnly : false;
    this.value = param.value ? param.value : undefined;
    this.formControlIndex = param.formControlIndex ? param.formControlIndex : undefined;
    this.formControlGroupKey = param.formControlGroupKey ? param.formControlGroupKey : undefined;
    this.requiredIf = param.requiredIf ? param.requiredIf : undefined;
    this.hidden = false;
    this.isRepeatable = param.isRepeatable ? param.isRepeatable : false;
    this.uniqueCondition = param.uniqueCondition ? param.uniqueCondition : undefined;
    this.containerClass = param.containerClass;
  }
}
