import { IPermission } from './../contracts';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';


export class PermissionBuilder implements ISerializableBuilder<Permission> {
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
  fromSerialized(serialized: any): Permission {
    return this.serializer.deserialize(Permission, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: Permission) {
    return this.serializer.serialize(Permission, value);
  }


}

/**
 * @description Manage application user permissions
 */
export class Permission implements IPermission {
  @JsonProperty('label')
  label: string = undefined;
  @JsonProperty('display_label')
  displayLabel: string = undefined;
  @JsonProperty('descriptions')
  description: string = undefined;
  @JsonProperty('id')
  id: any = undefined;

  /**
   * @description Permission instance initializer
   */
  constructor() { }
}
