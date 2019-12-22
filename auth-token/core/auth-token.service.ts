import { Injectable } from '@angular/core';
import { SessionStorage } from '../../storage/core/session-storage.service';
import { IAuthTokenService } from '../contracts/auth-token-interface';
import { environment } from 'src/environments/environment';

class TokenConfigs {
  public static USER_TOKEN_KEY = environment.authTokenStorageKey ? environment.authTokenStorageKey : 'X_Auth_Token';
}

@Injectable()
export class AuthTokenService implements IAuthTokenService {

  constructor(private sessionStorage: SessionStorage) {}
  get token() {
    return this.sessionStorage.get(TokenConfigs.USER_TOKEN_KEY);
  }
  set token(t: string) {
    this.sessionStorage.set(TokenConfigs.USER_TOKEN_KEY, t);
  }

  /**
   * @description Save connected user token to a temporary storage
   * @param token JWT string representation of the connected user
   * @return void
   */
  setToken(token: string): void {
    this.sessionStorage.set(TokenConfigs.USER_TOKEN_KEY, token);
  }

  /**
   * @description Removes connected user token from the temporary storage
   * @return void
   */
  removeToken(): void {
    this.sessionStorage.delete(TokenConfigs.USER_TOKEN_KEY);
  }
}
