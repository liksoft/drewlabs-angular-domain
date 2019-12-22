import { IHTMLFormControl } from './dynamic-input-interface';
import { JsonProperty } from 'src/app/lib/domain/built-value/core/serializers';

/**
 * @description Definitions for entities used as dynamic forms groups
 */
export interface IDynamicForm {
  title: string;
  description: string;
  forms: IDynamicForm[];
  controlConfigs?: IHTMLFormControl[];
  endpointURL: string;
}

export class DynamicForm implements IDynamicForm {
  forms: IDynamicForm[];
  title: string;
  description: string;
  controlConfigs: IHTMLFormControl[];
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
