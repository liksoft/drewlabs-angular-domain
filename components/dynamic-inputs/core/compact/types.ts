import { DynamicControlConfig } from '../contracts/dynamic-form-control';

export class IDynamicFormConfig {
  id: number = undefined;
  title: string = undefined;
  parentId: string = undefined;
  description: string = undefined;
  children: IDynamicFormConfig[] = undefined;
  formControls: DynamicControlConfig[] = undefined;
  url: string = undefined;
  status: number = undefined;
}
