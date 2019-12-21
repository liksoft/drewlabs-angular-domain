export interface IAuthTokenService {
  /**
   * @description Save connected user token to a temporary storage
   * @param token JWT string representation of the connected user
   * @return void
   */
  setToken(token: string): void;

  /**
   * @description Removes connected user token from the temporary storage
   * @return void
   */
  removeToken(): void;
}
