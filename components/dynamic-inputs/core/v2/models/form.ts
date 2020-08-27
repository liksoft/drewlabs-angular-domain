import { DynamicControlConfig } from '../../contracts/dynamic-form-control';
import { FormControlV2 } from './form-control';
import { IDynamicFormConfig } from '../../compact/types';

export class FormV2 implements IDynamicFormConfig {
  id: number = undefined;
  title: string = undefined;
  parentId: string = undefined;
  description: string = undefined;
  children: FormV2[] = undefined;
  formControls: DynamicControlConfig[] = undefined;
  url: string = undefined;
  status: number = undefined;

  public static getJsonableProperties(): { [index: string]: keyof FormV2 | { name: string, type: any } } {
    return {
      title: 'title',
      parentId: 'parentId',
      description: 'description',
      children: { name: 'children', type: FormV2 },
      formControls: { name: 'formControls', type: FormControlV2 },
      url: 'url',
      status: 'status'
    };
  }
}


export class FormControlOption {
  id: number = undefined;
  table: string = undefined;
  keyfield: string = undefined;
  groupfield: string = undefined;
  description: string = undefined;
  displayLabel: string = undefined;

  public static getJsonableProperties(): { [index: string]: keyof FormControlOption | { name: string, type: any } } {
    return {
      id: 'id',
      table: 'table',
      keyfield: 'keyfield',
      groupfield: 'groupfield',
      valuefield: 'description',
      display_label: 'displayLabel',
    };
  }
}
