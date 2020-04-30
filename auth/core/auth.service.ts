import { AuthUser } from '../contracts';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/operators/map';
import {
  ServerResponseKeys,
  AuthStorageConfig,
  AuthServerPathConfig
} from './config';
import { AuthTokenService } from '../../auth-token/core/auth-token.service';
import { User, USER_SERIALIZABLE_BUILDER } from '../models/user';
import { HttpRequestService } from '../../http/core/http-request.service';
import { ResponseData, IResponseBody, ResponseBody } from '../../http/contracts/http-response-data';
import { SessionStorage, LocalStorage, DataStoreService } from '../../storage/core';
import { ISerializableBuilder } from '../../built-value/contracts/serializers';
import { Subject } from 'rxjs';
import { AuthRememberTokenService } from '../../auth-token/core/auth-remember-token.service';

@Injectable()
export class AuthService {
  private isLoggedIn: boolean;
  redirectUrl: string;
  // public readonly userObserver: Subject<AuthUser> = new Subject();

  /**
   *
   * @param sessionStorage [[SessionStorage]]
   * @param inMemoryStorage [[DataStoreService]]
   * @param tokenServiceProvider [[AuthTokenService]]
   * @param httpService [[HttpRequestService]]
   * @param userBuilder [[ISerializableBuilder<User>]]
   * @param rememberTokenService [[AuthRememberTokenService]]
   */
  constructor(
    private sessionStorage: SessionStorage,
    private localStorage: LocalStorage,
    private inMemoryStorage: DataStoreService,
    private tokenServiceProvider: AuthTokenService,
    private httpService: HttpRequestService,
    @Inject(USER_SERIALIZABLE_BUILDER) private userBuilder: ISerializableBuilder<User>,
    private rememberTokenService: AuthRememberTokenService
  ) {
    // code...
    this.isLoggedIn = false;
  }

  get loggedIn() {
    return this.isLoggedIn;
  }

  set loggedIn(isloggedIn: boolean) {
    this.isLoggedIn = isloggedIn;
  }
  /**
   * @description User authentication handler
   * @param username username parameter for authentication
   * @param username  password parameter for authentication
   * @param rememberMe Idicates whether a remember token will be saved on successfull authentication
   */
  public authenticate(username: string, password: string, rememberMe: boolean = false) {
    return new Promise((resolve, reject) => {
      this.httpService
        .post(AuthServerPathConfig.LOGIN_PATH,
          Object.assign({ username, password, password_confirmation: password }, rememberMe ? { remember_me: true } : {})
        )
        .subscribe(
          (res: any) => {
            resolve(this.onAuthenticationResponse(res, rememberMe));
          },
          (error: any) => {
            reject(error);
          }
        );
    });
  }

  /**
   * @description Handler for authenticating a user via user id and a remember token
   * @param id [[string|number]] User system unique identifier
   * @param token [[string]] Remember token
   */
  public authenticateViaRememberToken(id: string | number, token: string) {
    return new Promise((resolve, reject) => {
      this.httpService
        .post(`${AuthServerPathConfig.LOGIN_PATH}/${id}`,
          { remember_token: token }
        )
        .subscribe(
          (res: any) => {
            resolve(this.onAuthenticationResponse(res));
          },
          (error: any) => {
            reject(error);
          }
        );
    });
  }

  /**
   * @description Logout the application user
   */
  public logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpService.get(AuthServerPathConfig.LOGOUT_PATH).subscribe(
        res => {
          const responseData: ResponseData = res[ServerResponseKeys.RESPONSE_DATA];
          if (
            responseData.success
          ) {
            this.sessionStorage.clear();
            this.localStorage.clear();
            this.inMemoryStorage.clear();
            this.removeUserFromstorage();
            // Maybe remove the remember_me token from the storage
          }
          resolve(responseData.success);
        },
        err => reject(err)
      );
    });
  }

  private onAuthenticationResponse(res: any, rememberMe: boolean = false) {
    const responseData: ResponseData =
      res[ServerResponseKeys.RESPONSE_DATA];
    const body: IResponseBody = new ResponseBody(responseData.body);
    if (
      responseData.success && body.data[ServerResponseKeys.AUTHENTICATED_KEY] === true
    ) {
      this.loggedIn = true;
      this.tokenServiceProvider.removeToken();
      this.tokenServiceProvider.setToken(
        body.data[ServerResponseKeys.TOKEN]
      );
      // Set user data to the store
      const authUser = (new User()).fromAuthenticationResponseBody(body, this.userBuilder);
      this.user = authUser;
      if (rememberMe) {
        this.rememberTokenService.setToken(this.user.rememberToken).setUserId(this.user.id);
      }
    }
    return body;
  }

  /**
   * @description Remove user data from the storage
   */
  private removeUserFromstorage(): void {
    this.sessionStorage.delete(AuthStorageConfig.USER_STORAGE_KEY);
    this.tokenServiceProvider.removeToken();
    this.isLoggedIn = false;
  }

  get user(): AuthUser {
    const user = this.sessionStorage.get(AuthStorageConfig.USER_STORAGE_KEY);
    return user ? (new User()).fromStorageObject(user, this.userBuilder) : null;
  }

  set user(user: AuthUser) {
    this.sessionStorage.set(
      AuthStorageConfig.USER_STORAGE_KEY,
      this.userBuilder.toSerialized(user as User)
    );
  }
}
