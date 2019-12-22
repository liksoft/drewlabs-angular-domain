import { IPermission } from '../contracts';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';


export class PermissionBuilder implements ISerializableBuilder<Permission>, TypeBuilder<Permission> {
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

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => Permission, params: object): Permission {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: Permission, params: object | Permission): Permission {
    return rebuildJSObjectType(instance, params);
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
  id: number = undefined;

  /**
   * @description Permission instance initializer
   */
  constructor() { }

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Permission> | ISerializableBuilder<Permission> {
    return new PermissionBuilder();
  }
}
