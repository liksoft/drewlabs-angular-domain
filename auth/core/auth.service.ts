import { AuthUser } from '../contracts';
import { Injectable, Inject } from '@angular/core';
import 'core-js/es6/object';
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
import { isDefined } from '../../utils/type-utils';

@Injectable()
export class AuthService {
  private isLoggedIn: boolean;
  redirectUrl: string;
  public readonly userObserver: Subject<AuthUser> = new Subject();

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
    // private localStorage: LocalStorage,
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
   */
  public authenticate(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.httpService
        .post(AuthServerPathConfig.LOGIN_PATH, {
          username,
          password,
          password_confirmation: password
        })
        .subscribe(
          (res: any) => {
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
              // console.log(this.user);
              if (isDefined(this.user.rememberToken)) {
                // console.log('Remember Token is Set');
                this.rememberTokenService.setToken(
                  this.user.rememberToken
                );
              }
            }
            resolve(body);
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
            // this.localStorage.clear();
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

  /**
   * @description Remove user data from the storage
   */
  private removeUserFromstorage(): void {
    this.sessionStorage.delete(AuthStorageConfig.USER_STORAGE_KEY);
    this.tokenServiceProvider.removeToken();
    this.isLoggedIn = false;
  }

  get user(): AuthUser {
    const user = this.sessionStorage.get(
      AuthStorageConfig.USER_STORAGE_KEY
    );
    return user ? (new User()).fromStorageObject(user, this.userBuilder) : null;
  }

  set user(user: AuthUser) {
    this.sessionStorage.set(
      AuthStorageConfig.USER_STORAGE_KEY,
      this.userBuilder.toSerialized(user as User)
    );
    // Notify User Observer listeners of the the new user value
    this.userObserver.next(user);
  }
}
