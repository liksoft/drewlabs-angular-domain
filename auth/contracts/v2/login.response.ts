import { AppUser, IAppUser } from './user/user';

export interface ILoginResponse {
  success: boolean;
  body: ILoginResponseBody;
  statusCode: number;
}

export interface ILoginResponseBody {
  errorMessage: string;
  responseData: ILoginResponseData;
  errors: any[];
}

export interface ILoginResponseData {
  loginState: ILoginState;
  user: IAppUser;
}

export interface ILoginState {
  authenticated: boolean;
  is2FactorAuthenticationEnabled: boolean;
  token: string;
}

export class LoginResponse implements ILoginResponse {
  success: boolean = undefined;
  body: LoginResponseBody = undefined;
  statusCode: number = undefined;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      success: 'success',
      body: { name: 'body', type: LoginResponseBody },
      code: 'statusCode'
    } as { [index: string]: keyof LoginResponse } | { [index: string]: any };
  }
}

export class LoginResponseBody implements ILoginResponseBody {
  errorMessage: string = undefined;
  responseData: LoginResponseData = undefined;
  errors: any[] = undefined;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      error_message: 'errorMessage',
      response_data: { name: 'responseData', type: LoginResponseData },
      errors: 'errors'
    } as { [index: string]: keyof LoginResponseBody } | { [index: string]: any };
  }
}

export class LoginResponseData implements ILoginResponseData {
  loginState: ILoginState = undefined;
  user: IAppUser = undefined;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      login_response: { name: 'loginState', type: LoginState },
      user: {name: 'user', type: AppUser},
    } as { [index: string]: keyof LoginResponseData } | { [index: string]: any };
  }
}

export class LoginState implements ILoginState {
  authenticated: boolean;
  is2FactorAuthenticationEnabled: boolean;
  token: string;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      authenticated: 'authenticated',
      double_auth_enabled: 'is2FactorAuthenticationEnabled',
      token: 'token'
    } as { [index: string]: keyof LoginState } | { [index: string]: any };
  }
}

