import { IUserRememberTokenParam } from '../../auth-token/contracts';
import { Authorizable, IAppUser, NotifiableUserDetails } from '../contracts/v2';

/**
 * @description Type definition for authentication service state
 */
export interface AuthState {
  isLoggedIn: boolean;
  is2FactorAuthActive?: boolean;
  isInitialState?: boolean;
  user: IAppUser | Authorizable | NotifiableUserDetails;
  token: string;
  authenticating?: boolean;
  rememberToken?: IUserRememberTokenParam;
}

export interface AuthStorageValues {
  user: IAppUser | Authorizable | NotifiableUserDetails;
  token: string;
  rememberToken: IUserRememberTokenParam;
}
