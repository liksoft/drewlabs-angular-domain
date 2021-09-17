import { IDynamicForm } from "../contracts/dynamic-form";
import { IHTMLFormControl } from "../contracts/dynamic-input";

export class DynamicForm implements IDynamicForm {
  id!: number | string;
  forms?: IDynamicForm[];
  title!: string;
  description?: string;
  controlConfigs!: IHTMLFormControl[] | any;
  endpointURL?: string;
  appcontext?: string;

  /**
   * @description DynamicForm instance initializer
   */
  constructor({
    id,
    title,
    description,
    controlConfigs,
    endpointURL,
    forms,
    appcontext,
  }: IDynamicForm) {
    this.id = id;
    this.title = title;
    this.controlConfigs = controlConfigs ? [...controlConfigs] : [];
    this.description = description;
    this.endpointURL = endpointURL;
    this.forms = forms;
    this.appcontext = appcontext;
  }
}
