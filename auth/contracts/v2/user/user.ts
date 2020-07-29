import { IAppUserDetails, AppUserDetails } from './user-details';
import * as lodash from 'lodash';

/**
 * Checkis if a given authorizable instance has any of the provided authorization
 */
export type AnyScopeFunc = (authorizable: Authorizable, authorizations: string[]) => boolean;

/**
 * Checks if an authorizable instance has a given scope in it authorizations
 */
export type ScopeFunc = (authorizable: Authorizable, authorization: string) => boolean;

/**
 * @description Handler function for checking a given user have any of the provided authorizations
 */
export const userCanAny = (authorizable: Authorizable, authorizations: string[]) => {
  return lodash.intersection(authorizable.authorizations, authorizations).length > 0;
};

/**
 * @description Handler function checking if a given user has the provided authorization
 */
export const userCan = (authorizable: Authorizable, authorization: string) => {
  return authorizable.authorizations.indexOf(authorization) !== -1;
};

export interface IAppUser {
  id: number | string;
  username: string;
  isVerified: boolean;
  isActive: boolean;
  is2FactorAuthActive: boolean;
  rememberToken: string;
  userDetails: IAppUserDetails;
}

export interface Authorizable {
  authorizations: string[];
  roles: string[];
}

export interface NotifiableUserDetails {
  channels: object[];
}

export class AppUser implements IAppUser, NotifiableUserDetails, Authorizable {
  username: string = undefined;
  id: number = undefined;
  password: string = undefined;
  rememberToken: string = undefined;
  twoFactorActive: number = undefined;
  authorizations: string[];
  roles: string[] = undefined;
  userDetails: IAppUserDetails = undefined;
  verified: number | boolean = undefined;
  active: number | boolean = undefined;
  doubleAuthActive: number | boolean = undefined;
  channels: object[] = undefined;


  get isVerified() {
    return Boolean(this.verified);
  }

  get isActive() {
    return Boolean(this.active);
  }

  get is2FactorAuthActive() {
    return Boolean(this.doubleAuthActive);
  }

  static getJsonableProperties() {
    return {
      username: 'username',
      is_verified: 'verified',
      active: 'active',
      double_auth_active: 'doubleAuthActive',
      remember_token: 'rememberToken',
      roles: 'roles',
      permissions: 'authorizations',
      channels: 'channels',
      user_info: { name: 'userDetails', type: AppUserDetails }
    } as { [index: string]: keyof AppUser } | { [index: string]: any };
  }
}
