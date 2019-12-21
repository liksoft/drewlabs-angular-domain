import { IPermission } from './../contracts/permission';
import { Role as IRole } from '../contracts';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';

export class RoleBuilder implements ISerializableBuilder<Role> {
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

}

export abstract class RoleAsViewable {

  permissions: IPermission[];

  get permissionLabels() {
    return this.permissions
      .map((v: IPermission) => v.label)
      .join(', ')
      .toUpperCase();
  }
}

export class Role extends RoleAsViewable implements IRole {
  @JsonProperty('label')
  label: string = undefined;
  @JsonProperty('display_label')
  displayLabel: string = undefined;
  @JsonProperty('description')
  description: string = undefined;
  @JsonProperty('id')
  id: any = undefined;
  @JsonProperty('permissions')
  permissions: IPermission[] = undefined;

  /**
   * @param data Instance initializer of object type
   */
  constructor() { super(); }

  /**
   * @description Checks if user has a given permission
   * @param label Label of the permission being looked for
   * @return Return a boolean true|false indicating whether role contains a given permission
   */
  public containsPermission(label: string): boolean {
    if (this.permissions) {
      const found = this.permissions.filter((el: IPermission) => {
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
}
