interface ITokenHandler {

  /**
   * @description Removes connected user token from the temporary storage
   * @return void
   */
  removeToken(): void;
}

export interface IAuthTokenHandler extends ITokenHandler {
  /**
   * @description Actual user saved token
   * @var [string]
   */
  token: string;
  /**
   * @description Save connected user token to a temporary storage
   * @param token JWT string representation of the connected user
   * @return void
   */
  setToken(token: string): any;
}

/**
 * @description Type definition for a user remember token param
 */
// tslint:disable-next-line: interface-over-type-literal
export type IUserRememberTokenParam = { userId: number | string, token: string };

export interface IRememberTokenHandler extends ITokenHandler {
  /**
   * @description Actual user saved token
   * @var [string]
   */
  token: IUserRememberTokenParam;
  /**
   * @description Save connected user remember token to the storage
   */
  setToken(param: IUserRememberTokenParam): void;

}
