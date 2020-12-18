import { ILoginResponse, IUserStorageHandler } from '../../contracts/v2';
import { IAuthTokenHandler, IRememberTokenHandler } from '../../../auth-token/contracts/auth-token';
import { OperatorFunction } from 'rxjs';


export interface LoginResponseWithAuthenticationResult {
  is2FactorAuthEnabled: boolean;
  isAutenticated: boolean;
  loginResponse: ILoginResponse;
}

export type LoginReponseHandlerFunc<T extends LoginResponseWithAuthenticationResult> = (
  userStorageHandler: IUserStorageHandler, tokenProvider: IAuthTokenHandler, rememberProvider: IRememberTokenHandler, remember?: boolean)
  => OperatorFunction<any, T>;
