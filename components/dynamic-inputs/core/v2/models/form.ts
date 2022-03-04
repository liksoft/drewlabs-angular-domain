import { FormControlV2 } from './form-control';
import { ControlOptionInterface, DynamicFormControlInterface, DynamicFormInterface } from '../../compact/types';
import { GenericSerializaleSerializer, UndecoratedSerializer } from '../../../../../built-value/core/js/serializer';
import { ISerializableBuilder } from '../../../../../built-value/contracts';

export class FormV2 implements DynamicFormInterface {
  id: number = undefined;
  title: string = undefined;
  parentId: string = undefined;
  description: string = undefined;
  children: FormV2[] = undefined;
  formControls: DynamicFormControlInterface[] = [];
  url: string = undefined;
  status: number = undefined;
  appcontext: string = undefined;

  static builder(): ISerializableBuilder<FormV2> {
    return new GenericSerializaleSerializer(FormV2, new UndecoratedSerializer());
  }

  public static getJsonableProperties(): { [index: string]: keyof FormV2 | { name: string, type: any } } {
    return {
      title: 'title',
      parentId: 'parentId',
      description: 'description',
      children: { name: 'children', type: FormV2 },
      formControls: { name: 'formControls', type: FormControlV2 },
      url: 'url',
      status: 'status',
      id: 'id',
      appcontext: 'appcontext'
    };
  }
}


export class ControlOption implements ControlOptionInterface {
  id: number = undefined;
  table: string = undefined;
  keyfield: string = undefined;
  groupfield: string = undefined;
  description: string = undefined;
  displayLabel: string = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder() {
    return new GenericSerializaleSerializer<ControlOptionInterface>(ControlOption, new UndecoratedSerializer);
  }

  static getJsonableProperties(): { [index: string]: keyof ControlOption } | { [index: string]: { name: string, type: any } } {
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

