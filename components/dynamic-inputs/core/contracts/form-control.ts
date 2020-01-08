import { IDynamicForm } from './dynamic-form';
import { isArray } from '../../../../utils/type-utils';
import { ArrayUtils } from '../../../../utils/array-utils';
import { IHTMLFormControl } from './dynamic-input-interface';

/**
 * @description Sort a dynamic form control configs by their [[formControlIndex]] property in the ascending order
 * @param form [[IDynamicForm]]
 */
export function sortFormByIndex(form: IDynamicForm): IDynamicForm {
  const loopThroughFormsFn = (f: IDynamicForm) => {
    if (isArray(f.forms) && f.forms.length > 0) {
      f.forms.forEach((i) => {
        loopThroughFormsFn(i);
      });
    }
    if (isArray(f.controlConfigs) && (f.controlConfigs as Array<IHTMLFormControl>).length > 0) {
      f.controlConfigs = ArrayUtils.sort((f.controlConfigs as Array<IHTMLFormControl>), 'formControlIndex', 1) as IHTMLFormControl[];
    }
    return f;
  };
  return loopThroughFormsFn(form);
}

/**
 * @description Interface definition for model that are bind to the dynamic form instance
 */
export interface IDynamicFormBindableModel {
  /**
   * @description Returns the bindings definitions of the model property keys to form control name attributes
   */
  formViewModelBindings(): { [index: string]: any };
}

export interface FormControlModel {
  id: number;
  label: string;
  placeholder: string;
  type: string;
  classes: string;
  requiredIf: string;
  required: number;
  disabled: number;
  readonly: number;
  unique: number;
  pattern: string;
  description: string;
  maxLength: number;
  minLength: number;
  min: number;
  max: number;
  minDate: string;
  maxDate: string;
  selectableValues: string;
  selectableModel: string;
  multiple: number;
  controlGroupKey: string;
  controlName: string;
  controlIndex: number;
  options: object[];
  rows: number;
  columns: number;
  value: string;
  uploadURL: string;
  isRepeatable: number;
  children: FormControlModel[];
  uniqueOn: string;
  dynamicControlContainerClass: string;

  toDynamicControl(): IHTMLFormControl;
}
