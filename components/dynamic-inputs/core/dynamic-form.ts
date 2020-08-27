import { ICollection } from '../../../contracts/collection-interface';
import { IDynamicForm } from './contracts/dynamic-form';
import { IHTMLFormControl } from './contracts/dynamic-input';

export class DynamicForm implements IDynamicForm {
  forms: IDynamicForm[];
  title: string;
  description: string;
  controlConfigs: IHTMLFormControl[]|any;
  endpointURL: string;

  /**
   * @description DynamicForm instance initializer
   */
  constructor({title, description, controlConfigs, endpointURL, forms}: IDynamicForm) {
    this.title = title;
    this.controlConfigs = controlConfigs;
    this.description = description;
    this.endpointURL = endpointURL;
    this.forms = forms;
  }
}
