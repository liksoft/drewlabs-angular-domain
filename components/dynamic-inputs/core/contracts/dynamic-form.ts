import { IHTMLFormControl } from './dynamic-input-interface';
import { ICollection } from '../../../../contracts/collection-interface';
import { isDefined } from '../../../../utils/type-utils';

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

export class DynamicForm implements IDynamicForm {
  forms: IDynamicForm[];
  title: string;
  description: string;
  controlConfigs: IHTMLFormControl[] | ICollection<IHTMLFormControl>;
  endpointURL: string;

  /**
   * @description DynamicForm instance initializer
   */
  constructor({ title, description, controlConfigs, endpointURL, forms }: IDynamicForm) {
    this.title = title;
    this.controlConfigs = controlConfigs;
    this.description = description;
    this.endpointURL = endpointURL;
    this.forms = forms;
  }
}


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
