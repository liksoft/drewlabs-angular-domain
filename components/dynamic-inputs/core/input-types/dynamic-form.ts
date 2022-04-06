import { IDynamicForm } from '../types/form';
import { InputInterface } from '../types/input';

/**
 * @deprecated
 */
export class DynamicForm implements IDynamicForm {
  id!: number | string;
  controlConfigs: InputInterface[] = [];
  forms?: IDynamicForm[];
  title!: string;
  description?: string;
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
    appcontext,
  }: IDynamicForm) {
    this.id = id;
    this.title = title;
    this.controlConfigs = controlConfigs ? [...controlConfigs] : [];
    this.description = description;
    this.endpointURL = endpointURL;
    this.appcontext = appcontext;
  }
}
