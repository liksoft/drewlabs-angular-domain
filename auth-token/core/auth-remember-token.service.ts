import { IAuthTokenService } from '../contracts/auth-token-interface';
import { Injectable } from '@angular/core';
import { LocalStorage } from '../../storage/core/local-storage.service';
import { environment } from 'src/environments/environment';

class RememberTokenStorageConfigs {
  public static TokenKeyName = environment.authRememberTokenStorageKey ?
    environment.authRememberTokenStorageKey :
    'X_Auth_Remember_Token';
}

@Injectable()
export class AuthRememberTokenService implements IAuthTokenService {

  constructor(private cache: LocalStorage) { }

  public get token() {
    return this.cache.get(RememberTokenStorageConfigs.TokenKeyName);
  }

  /**
   * @inheritdoc
   */
  setToken(t: string): void {
    this.cache.set(RememberTokenStorageConfigs.TokenKeyName, t);
  }

  /**
   * @inheritdoc
   */
  removeToken(): void {
    this.cache.delete(RememberTokenStorageConfigs.TokenKeyName);
  }

}
