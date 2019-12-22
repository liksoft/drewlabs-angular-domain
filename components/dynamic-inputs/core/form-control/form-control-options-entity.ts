import { JsonProperty, ObjectSerializer } from 'src/app/lib/domain/built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from 'src/app/lib/domain/built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from 'src/app/lib/domain/built-value/contracts/type';

export class FormControlOptionsEntityBuilder
implements ISerializableBuilder<FormControlOptionsEntity>, TypeBuilder<FormControlOptionsEntity> {
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
  fromSerialized(serialized: any): FormControlOptionsEntity {
    return this.serializer.deserialize(FormControlOptionsEntity, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: FormControlOptionsEntity) {
    return this.serializer.serialize(FormControlOptionsEntity, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => FormControlOptionsEntity, params: object): FormControlOptionsEntity {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: FormControlOptionsEntity, params: object | FormControlOptionsEntity): FormControlOptionsEntity {
    return rebuildJSObjectType(instance, params);
  }

}

export class FormControlOptionsEntity {
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('table')
  table: string = undefined;
  @JsonProperty('keyfield')
  keyfield: string = undefined;
  @JsonProperty('groupfield')
  groupfield: string = undefined;
  @JsonProperty('valuefield')
  description: string = undefined;
  @JsonProperty('display_label')
  displayLabel: string = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<FormControlOptionsEntity> | ISerializableBuilder<FormControlOptionsEntity> {
    return new FormControlOptionsEntityBuilder();
  }

  // formViewModelBindings(): {[index: string]: any} {
  //   return {
  //     forms_title: 'title',
  //     forms_description: 'description',
  //     forms_parent_id: 'parentId',
  //     forms_endpoint_url: 'url'
  //   };
  // }
}
