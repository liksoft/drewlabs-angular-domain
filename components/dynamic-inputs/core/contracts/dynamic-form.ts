import { IHTMLFormControl } from './dynamic-input';
import { ICollection } from '../../../../contracts/collection-interface';
import { isDefined } from '../../../../utils';
/**
 * @description Interface definition for model that are bind to the dynamic form instance
 */
export interface FormViewModel {
  /**
   * @description Returns the bindings definitions of the model property keys to form control name attributes
   */
  formViewModelBindings(): { [index: string]: any };
}

/**
 * @description Definitions for entities used as dynamic forms groups
 */
export interface IDynamicForm {
  title: string;
  description: string;
  forms: IDynamicForm[];
  controlConfigs?: IHTMLFormControl[] | ICollection<IHTMLFormControl>;
  endpointURL: string;
}

/**
 * @description Type definition for function for mapping models to form view bindings
 * @param model Parameter can be any JS object with properties that can be bind to a dynamic form values
 */
export type ModelToFormViewModelBindings = (model: object|any) => { [index: string]: any };


/**
 * @description Create a copy of the IDynamic form object
 * @param value [[IDynamicForm]]
 */
export function clone(value: IDynamicForm) {
  return Object.assign(value, {
    // tslint:disable-next-line: max-line-length
    controlConfigs: isDefined(value.controlConfigs) ? [...(value.controlConfigs as IHTMLFormControl[]).map(i => Object.assign({}, i))] : null,
    forms: isDefined(value.forms) ? (value.forms as IDynamicForm[]).map(i => clone(i)) : null
  });
}
