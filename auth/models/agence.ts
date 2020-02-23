import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializableBuilder, ISerializer } from '../../built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';
import { IDynamicFormBindableModel } from '../../components/dynamic-inputs/core/contracts/form-control';

export class AgenceBuilder implements ISerializableBuilder<Agence>, TypeBuilder<Agence> {
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
  fromSerialized(serialized: any): Agence {
    return this.serializer.deserialize(Agence, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: Agence) {
    return this.serializer.serialize(Agence, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => Agence, params: object): Agence {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: Agence, params: object | Agence): Agence {
    return rebuildJSObjectType(instance, params);
  }

}

export class Agence implements IDynamicFormBindableModel {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('label')
  label: string = undefined;
  @JsonProperty('description')
  description: string = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Agence> | ISerializableBuilder<Agence> {
    return new AgenceBuilder();
  }

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return (Agence.builder() as ISerializableBuilder<Agence>).toSerialized(this);
  }
}
