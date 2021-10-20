import { OperatorFunction } from "rxjs";
import {
  IAuthTokenHandler,
  IRememberTokenHandler,
} from "../../../auth-token/contracts";
import { ILoginResponse, IUserStorageHandler } from "../../contracts";

export interface LoginResponseWithAuthenticationResult {
  is2FactorAuthEnabled: boolean;
  isAutenticated: boolean;
  loginResponse: ILoginResponse;
}

export type LoginReponseHandlerFunc<
  T extends LoginResponseWithAuthenticationResult
> = (
  userStorageHandler: IUserStorageHandler,
  tokenProvider: IAuthTokenHandler,
  rememberProvider: IRememberTokenHandler,
  remember?: boolean
) => OperatorFunction<any, T>;
