import { IAuthTokenService } from '../contracts/auth-token-interface';
import { Injectable } from '@angular/core';
import { LocalStorage } from '../../storage/core/local-storage.service';
import { environment } from 'src/environments/environment';

class RememberTokenStorageConfigs {
  public static TokenKeyName = environment.authRememberTokenStorageKey ?
    environment.authRememberTokenStorageKey :
    'X_Auth_Remember_Token';
    public static UserIDKeyName = 'X_Auth_User_Id';
}

@Injectable()
export class AuthRememberTokenService implements IAuthTokenService {

  constructor(private cache: LocalStorage) { }

  public get token() {
    return this.cache.get(RememberTokenStorageConfigs.TokenKeyName) as string;
  }

  public get userId(): string|number {
    return this.cache.get(RememberTokenStorageConfigs.UserIDKeyName);
  }

  /**
   * Set the user id property
   * @param id [[string|number]]
   */
  setUserId(id: string|number) {
    this.cache.set(RememberTokenStorageConfigs.UserIDKeyName, id);
    return this;
  }

  /**
   * @inheritdoc
   */
  setToken(t: string) {
    this.cache.set(RememberTokenStorageConfigs.TokenKeyName, t);
    return this;
  }

  /**
   * @inheritdoc
   */
  removeToken(): void {
    this.cache.delete(RememberTokenStorageConfigs.TokenKeyName);
    // Delete the user id as well
    this.cache.delete(RememberTokenStorageConfigs.UserIDKeyName);
  }

}
