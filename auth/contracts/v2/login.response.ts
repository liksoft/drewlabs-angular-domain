import { IHttpResponseData } from '../../../http/contracts';
import { AppUser, IAppUser } from './user/user';

export interface ILoginResponse extends IHttpResponseData {
  body?: ILoginResponseBody;
  statusCode: number;
}

export interface ILoginResponseBody {
  errorMessage: string;
  responseData?: ILoginResponseData;
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
  body!: LoginResponseBody;
  statusCode!: number;

  getContent() {
    return this.body?.responseData;
  }

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      body: { name: 'body', type: LoginResponseBody },
      code: 'statusCode'
    } as { [index: string]: keyof LoginResponse } | { [index: string]: any };
  }
}

// Added to Add support for new structure of the http response
export class LoginV2_1Response implements ILoginResponse, ILoginResponseBody {

  statusCode!: number;
  errorMessage!: string;
  responseData!: LoginResponseData;
  errors!: any[];

  getContent() {
    return this.responseData;
  }

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      code: 'statusCode',
      error_message: 'errorMessage',
      response_data: { name: 'responseData', type: LoginResponseData },
      errors: 'errors'
    } as { [index: string]: keyof ILoginResponse & ILoginResponseBody } | { [index: string]: any };
  }
}

export class LoginResponseBody implements ILoginResponseBody {
  errorMessage!: string;
  responseData!: LoginResponseData;
  errors!: any[];

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
  loginState!: ILoginState;
  user!: IAppUser;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      login_response: { name: 'loginState', type: LoginState },
      user: {name: 'user', type: AppUser},
    } as { [index: string]: keyof LoginResponseData } | { [index: string]: any };
  }
}

export class LoginState implements ILoginState {
  authenticated!: boolean;
  is2FactorAuthenticationEnabled!: boolean;
  token!: string;

  // Static method definition for attribute parsing
  static getJsonableProperties = () => {
    return {
      authenticated: 'authenticated',
      double_auth_enabled: 'is2FactorAuthenticationEnabled',
      token: 'token'
    } as { [index: string]: keyof LoginState } | { [index: string]: any };
  }
}

