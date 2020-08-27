import { Role as IRole } from '../contracts';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { TypeBuilder, buildJSObjectType, rebuildJSObjectType } from '../../built-value/contracts/type';
import { Permission } from './permission';

/**
 * @deprecated
 */
export class RoleBuilder implements ISerializableBuilder<Role>, TypeBuilder<Role> {
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
  fromSerialized(serialized: any): Role {
    return this.serializer.deserialize(Role, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: Role) {
    return this.serializer.serialize(Role, value);
  }

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => Role, params: object): Role {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: Role, params: object | Role): Role {
    return rebuildJSObjectType(instance, params);
  }

}

export abstract class RoleAsViewable {

  permissions: Permission[];

  get permissionLabels() {
    return this.permissions
      .map((v: Permission) => v.label)
      .join(', ')
      .toUpperCase();
  }
}

/**
 * @deprecated
 */
export class Role extends RoleAsViewable implements IRole {
  @JsonProperty('label')
  label: string = undefined;
  @JsonProperty('display_label')
  displayLabel: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('is_admin_user_role')
  isAdminUserRole: number = undefined;
  @JsonProperty({ name: 'permissions', valueType: Permission })
  permissions: Permission[] = undefined;

  /**
   * @param data Instance initializer of object type
   */
  constructor() { super(); }

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<Role> | ISerializableBuilder<Role> {
    return new RoleBuilder();
  }

  /**
   * @description Checks if user has a given permission
   * @param label Label of the permission being looked for
   * @return Return a boolean true|false indicating whether role contains a given permission
   */
  public containsPermission(label: string): boolean {
    if (this.permissions) {
      const found = this.permissions.filter((el: Permission) => {
        return el.label.toString() === label.toString();
      });
      if (found.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * @description Checks if user has a given permission in a permission list
   * @param permissions list of permissions to loop through
   * @return Return a boolean true|false indicating whether role contains a given permission in a permission list
   */
  public containsPermissions(permissions: string[]): boolean {
    if (permissions && permissions.length > 0) {
      let found = false;
      for (const i of permissions) {
        if (this.containsPermission(i)) {
          found = true;
          break;
        }
      }
      return found;
    }
    return true;
  }

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return {
      roles_label: 'label',
      roles_display_label: 'displayLabel',
      roles_description: 'description',
      roles_is_admin_user_role: 'isAdminUserRole',
      permissions: 'permissions'
    };
  }
}
