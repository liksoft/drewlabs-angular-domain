import { Permission } from './permission';
import { Role } from './role';
import { AuthUser } from '../contracts/user';
import { ServerResponseKeys } from '../core/config';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { InjectionToken } from '@angular/core';
import { isDefined } from '../../utils/type-utils';
import { UserInfoEntity } from './user-info';


export class UserBuilder implements ISerializableBuilder<User> {
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
  fromSerialized(serialized: any): User {
    return this.serializer.deserialize(User, serialized);
  }

  /**
   * @inheritdoc
   */
  toSerialized(value: User) {
    return this.serializer.serialize(User, value);
  }

}

/**
 * @description Injection provider for the user builder class
 */
export const USER_SERIALIZABLE_BUILDER = new InjectionToken<ISerializableBuilder<User>>('User_$Serializable_$Builder', {
  providedIn: 'root',
  factory: () => new UserBuilder()
});

export abstract class UserAsViewable {

}

export class User extends UserAsViewable implements AuthUser {

  @JsonProperty('username')
  username: string = undefined;
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('password')
  password: string = undefined;
  @JsonProperty('is_active')
  isActive: number = undefined;
  @JsonProperty('double_auth_active')
  twoFactorActive: number = undefined;
  @JsonProperty({name: 'permissions', valueType: Permission})
  permissions: Permission[] = undefined;
  @JsonProperty({name: 'roles', valueType: Role})
  roles: Role[] = undefined;
  @JsonProperty({name: 'user_info', valueType: UserInfoEntity})
  userInfo: UserInfoEntity = undefined;

  status: number = undefined;

  /**
   *
   */
  constructor() {
    super();
  }

  get fullname() {
    if (this.userInfo) {
      return this.userInfo.firstname + ' ' + this.userInfo.lastname;
    }
    return '';
  }

  get rolesList(): string {
    return ((this.roles as Role[]).map(v => {
      return v.label;
    })).join(', ');
  }

  setPermissions(permissions: Permission[]) {
    this.permissions = permissions;
  }

  setRoles(roles: Role[]) {
    this.roles = roles;
  }

  getRoles(): Role[] {
    return this.roles;
  }

  getPermissions(): Permission[] {
    return this.permissions;
  }

  fromAuthenticationResponseBody(body: import('../../http/core').IResponseBody, builder: ISerializableBuilder<User>): AuthUser {
    const user: any = body.data[ServerResponseKeys.USER_KEY];
    return isDefined(user) ? this.fromStorageObject(user, builder) : null;
  }

  fromStorageObject(value: object, builder: ISerializableBuilder<User>): AuthUser {
    return builder.fromSerialized(value);
  }
}
