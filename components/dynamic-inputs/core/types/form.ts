import { InputInterface } from './input';

export interface IDynamicForm {
  id: number | string;
  title: string;
  description?: string;
  controlConfigs: InputInterface[];
  endpointURL?: string;
  appcontext?: string;
}
