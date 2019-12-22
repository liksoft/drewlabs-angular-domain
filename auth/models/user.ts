import { Permission } from './permission';
import { Role } from './role';
import { AuthUser } from '../contracts/user';
import { ServerResponseKeys } from '../core/config';
import { JsonProperty, ObjectSerializer } from '../../built-value/core/serializers';
import { ISerializer, ISerializableBuilder } from '../../built-value/contracts/serializers';
import { InjectionToken } from '@angular/core';
import { isDefined } from '../../utils/type-utils';
import { UserInfoEntity } from './user-info';
import { TypeBuilder, rebuildJSObjectType, buildJSObjectType } from '../../built-value/contracts/type';


export class UserBuilder implements ISerializableBuilder<User>, TypeBuilder<User> {
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

  /**
   * @inheritdoc
   */
  build(bluePrint: new () => User, params: object): User {
    return buildJSObjectType(bluePrint, params);
  }

  /**
   * @inheritdoc
   */
  rebuild(instance: User, params: object | User): User {
    return rebuildJSObjectType(instance, params);
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

  @JsonProperty('username')
  username: string = undefined;
  @JsonProperty('id')
  id: number = undefined;
  @JsonProperty('password')
  password: string = undefined;
  @JsonProperty('remember_token')
  rememberToken: string = undefined;
  @JsonProperty('is_active')
  isActive: number = undefined;
  @JsonProperty('double_auth_active')
  twoFactorActive: number = undefined;
  @JsonProperty({ name: 'permissions', valueType: Permission })
  permissions: Permission[] = undefined;
  @JsonProperty({ name: 'roles', valueType: Role })
  roles: Role[] = undefined;
  @JsonProperty({ name: 'user_info', valueType: UserInfoEntity })
  userInfo: UserInfoEntity = undefined;

  status: number = undefined;

  /**
   * @description Calls to get the builder provider of the current class|type
   */
  static builder(): TypeBuilder<User> | ISerializableBuilder<User> {
    return new UserBuilder();
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

  /**
   * @inheritdoc
   */
  formViewModelBindings(): { [index: string]: any } {
    return {
      username: 'username',
      password: null,
      password_confirmation: 'password',
      is_active: 'isActive',
      is_affiliated_to_department: null,
      roles: null,
      usr_info_firstname: 'userInfo.firstname',
      usr_info_lastname: 'userInfo.lastname',
      usr_info_address: 'userInfo.address',
      usr_info_email: 'userInfo.email',
      usr_info_other_email: 'userInfo.otherEmail',
      usr_info_phone_number: 'userInfo.phoneNumber',
      usr_info_postal_code: 'userInfo.postalCode',
      usr_info_birthdate: 'userInfo.birthdate',
      usr_info_sex: 'userInfo.sex',
      usr_info_organisation_id: 'userInfo.organisationID',
      usr_info_department_id: 'userInfo.departmentID',
      is_department_manager: null,
    };
  }
}
