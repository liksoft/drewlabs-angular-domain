import { Injectable, Inject } from '@angular/core';
import { SessionStorage } from '../../storage/core/session-storage.service';
import { IAuthTokenHandler } from '../contracts/auth-token';
import { createStateful } from '../../rxjs/helpers';
import { isDefined } from '../../utils/types/type-utils';
import { Log } from '../../utils/logger';


@Injectable()
export class AuthTokenService implements IAuthTokenHandler {

  constructor(
    private sessionStorage: SessionStorage,
    @Inject('DREWLABS_USER_TOKEN_KEY') private tokenStorageKey: string) { }

  // tslint:disable-next-line: variable-name
  public _authToken$ = createStateful<string>(null);
  get authToken$() {
    return this._authToken$.asObservable();
  }

  get token() {
    return this.loadTokenFromCache();
  }

  set token(t: string) {
    this.setToken(t);
  }

  loadOAuthTokenWithStateUpdate() {
    const token = this.loadTokenFromCache();
    this._authToken$.next(token);
    return token;
  }

  loadTokenFromCache() {
    return this.sessionStorage.get(this.tokenStorageKey);
  }

  /**
   * @description Save connected user token to a temporary storage
   * @param token JWT string representation of the connected user
   * @return void
   */
  setToken(token: string): void {
    this._authToken$.next(token);
    this.sessionStorage.set(this.tokenStorageKey, token);
  }

  /**
   * @description Removes connected user token from the temporary storage
   * @return void
   */
  removeToken(): void {
    this._authToken$.next(null);
    this.sessionStorage.delete(this.tokenStorageKey);
  }
}
