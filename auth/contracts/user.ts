import { Role } from './role';
import { Permission } from '../models/permission';
import { IResponseBody } from '../../http/contracts/http-response-data';
import { ISerializableBuilder } from '../../built-value/contracts/serializers';
import { UserInfoEntity } from '../models/user-info';


/**
 * @deprecated
 */
export interface AuthUser {
  id: number | string;
  username: string;
  password: string;
  isActive: boolean | number;
  rememberToken: string;
  twoFactorActive: number;
  roles: Array<Role>;
  permissions: Permission[];
  userInfo: UserInfoEntity;
  status: number;

  /**
   * @description Get the list of [Role] associated with the current user
   */
  getRoles(): Array<Role>;

  /**
   * @description Create an application user from data provided by the response body
   * @param body [[IResponseBody]]
   * @param builder [[ISerializableBuilder<AuthUser>]]
   */
  fromAuthenticationResponseBody(body: IResponseBody, builder: ISerializableBuilder<AuthUser>): AuthUser;

  /**
   * @description Create an application user from value loaded from application localstorage
   * @param value [[object]]
   * @param builder [[ISerializableBuilder<AuthUser>]]
   */
  fromStorageObject(value: object, builder: ISerializableBuilder<AuthUser>): AuthUser;

  /**
   * @description Check if this instance can perform a certain action
   * @param permission permission label
   */
  can(permission: string): boolean;

  /**
   * @description Checks if this instance can perform any of the actions passed as parameter
   * @param permissions list of permission labels
   */
  canAny(permissions: string[]): boolean;
}
