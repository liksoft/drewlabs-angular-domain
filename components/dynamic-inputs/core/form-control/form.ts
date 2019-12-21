import { JsonProperty, ObjectSerializer } from 'src/app/lib/domain/built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from 'src/app/lib/domain/built-value/contracts/type';
import { FormControl } from './form-control';

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

export class Form {

  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('title')
  title: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty({name: 'children', valueType: Form})
  children: Form[] = undefined;
  @JsonProperty({name: 'formControls', valueType: FormControl})
  formControls: FormControl[] = undefined;
  @JsonProperty('url')
  url: string = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Form> | ISerializableBuilder<Form> {
    return new FormBuilder();
  }
}
