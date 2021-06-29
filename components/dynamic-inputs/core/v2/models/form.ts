import { FormControlV2 } from './form-control';
import { ControlOptionInterface, DynamicFormControlInterface, DynamicFormInterface } from '../../compact/types';
import { GenericSerializaleSerializer, UndecoratedSerializer } from '../../../../../built-value/core/js/serializer';
import { ISerializableBuilder } from '../../../../../built-value/contracts';

export class FormV2 implements DynamicFormInterface {
  id!: number;
  title!: string;
  parentId!: string;
  description!: string;
  children!: FormV2[];
  formControls: DynamicFormControlInterface[] = [];
  url!: string;
  status!: number;
  appcontext!: string;

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
  id!: number;
  table!: string;
  keyfield!: string;
  groupfield!: string;
  description!: string;
  displayLabel!: string;

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

