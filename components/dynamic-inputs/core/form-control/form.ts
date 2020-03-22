import { JsonProperty, ObjectSerializer } from 'src/app/lib/domain/built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from 'src/app/lib/domain/built-value/contracts/type';
import { FormControl } from './form-control';
import { IDynamicFormBindableModel } from '../contracts/form-control';
import { ArrayUtils } from '../../../../utils/array-utils';
import { isArray } from '../../../../utils/type-utils';

/**
 * @description Sort form loaded from backend server by control index
 * @param f [[Form]]
 */
export function sortFormFormControlsByIndex(f: Form) {
  if (isArray(f.formControls) && (f.formControls as Array<FormControl>).length > 0) {
    f.formControls = ArrayUtils.sort((f.formControls as Array<FormControl>), 'controlIndex', 1) as FormControl[];
  }
  return f;
}
export class FormBuilder implements ISerializableBuilder<Form>, TypeBuilder<Form> {
  serializer: ISerializer;

  /**
   *
   */
  constructor() {
    this.serializer = new ObjectSerializer();
  }

  /**
   * @inheritdoc
   */
  fromSerialized(serialized: any): Form {
    return this.serializer.deserialize(Form, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: Form) {
    return this.serializer.serialize(Form, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => Form, params: object): Form {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: Form, params: object | Form): Form {
    return rebuildJSObjectType(instance, params);
  }

}

export class Form implements IDynamicFormBindableModel {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('title')
  title: string = undefined;
  @JsonProperty('parentId')
  parentId: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty({name: 'children', valueType: Form})
  children: Form[] = undefined;
  @JsonProperty({name: 'formControls', valueType: FormControl})
  formControls: FormControl[] = undefined;
  @JsonProperty('url')
  url: string = undefined;
  @JsonProperty('status')
  status: number = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Form> | ISerializableBuilder<Form> {
    return new FormBuilder();
  }

  formViewModelBindings(): {[index: string]: any} {
    return {
      forms_title: 'title',
      forms_description: 'description',
      forms_parent_id: 'parentId',
      forms_endpoint_url: 'url'
    };
  }
}
