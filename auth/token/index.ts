import { IRememberTokenHandler, IUserRememberTokenParam, IAuthTokenHandler } from "./contracts";
import { Injectable, Inject, Optional } from "@angular/core";
import { LocalStorage } from "../../storage/core/local-storage.service";
import { SessionStorage } from "../../storage/core/session-storage.service";
import { createStateful } from "../../rxjs/helpers";

@Injectable({
  providedIn: "root",
})
export class AuthRememberTokenService implements IRememberTokenHandler {
  constructor(
    private cache: LocalStorage,
    @Optional()
    @Inject("DREWLABS_USER_REMEMBER_TOKEN_KEY")
    private name: string = "X_AUTH_REMEMBER_TOKEN"
  ) {}

  public get token() {
    return this.cache.get(this.name) as IUserRememberTokenParam;
  }

  /**
   * @inheritdoc
   */
  setToken(params: IUserRememberTokenParam) {
    this.cache.set(this.name, params);
    return this;
  }

  /**
   * @inheritdoc
   */
  removeToken(): void {
    this.cache.delete(this.name);
  }
}
@Injectable({
  providedIn: "root",
})
export class AuthTokenService implements IAuthTokenHandler {
  constructor(
    private sessionStorage: SessionStorage,
    @Inject("DREWLABS_USER_TOKEN_KEY") private tokenStorageKey: string
  ) {}

  // tslint:disable-next-line: variable-name
  public _authToken$ = createStateful<string | undefined>(undefined);
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
    this._authToken$.next(undefined);
    this.sessionStorage.delete(this.tokenStorageKey);
  }
}
