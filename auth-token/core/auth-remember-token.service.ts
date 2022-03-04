import { IRememberTokenHandler, IUserRememberTokenParam } from '../contracts';
import { Injectable, Inject } from '@angular/core';
import { LocalStorage } from '../../storage/core/local-storage.service';

@Injectable()
export class AuthRememberTokenService implements IRememberTokenHandler {

  constructor(
    private cache: LocalStorage,
    @Inject('DREWLABS_USER_REMEMBER_TOKEN_KEY') private tokenStorageKey: string = 'X_AUTH_REMEMBER_TOKEN'
  ) { }

  public get token() {
    return this.cache.get(this.tokenStorageKey) as IUserRememberTokenParam;
  }

  /**
   * @inheritdoc
   */
  setToken(params: IUserRememberTokenParam) {
    this.cache.set(this.tokenStorageKey, params);
    return this;
  }

  /**
   * @inheritdoc
   */
  removeToken(): void {
    this.cache.delete(this.tokenStorageKey);
  }

}
