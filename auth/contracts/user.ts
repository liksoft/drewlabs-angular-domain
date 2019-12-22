import {Role} from './role';
import { Permission } from '../models/permission';
import { IResponseBody } from '../../http/contracts/http-response-data';
import { ISerializableBuilder } from '../../built-value/contracts/serializers';
import { UserInfoEntity } from '../models/user-info';

export interface AuthUser {
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
}
