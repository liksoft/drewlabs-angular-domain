import { Inject, Injectable, OnDestroy } from "@angular/core";
import { AuthPathConfig } from "./config";
import {
  AuthTokenService,
  AuthRememberTokenService,
} from "../token";
import { createSubject, observableOf, timeout } from "../../rxjs/helpers";
import {
  mergeMap,
  catchError,
  takeUntil,
  tap,
  filter,
  delay,
} from "rxjs/operators";
import { throwError, merge } from "rxjs";
import { ILoginRequest, ILoginResponse } from "../contracts/v2";
import { UserStorageProvider } from "./services/user-storage";
import { HttpErrorResponse } from "@angular/common/http";
import { ILoginResponseBody } from "../contracts/v2/login.response";
import {
  IAppUser,
  Authorizable,
  NotifiableUserDetails,
} from "../contracts/v2/user/user";
import { isDefined } from "../../utils/types/type-utils";
import { SessionStorage } from "../../storage/core/session-storage.service";
import { Router } from "@angular/router";
import { AuthState, AuthStorageValues } from "./actions";
import { createStore } from "../../rxjs/state/rx-state";
import {
  intitAuthStateAction,
  authenticatingAction,
  authenticationRequestCompletedAction,
} from "./actions";
import { authReducer } from "./reducers";
import { Log } from "../../utils/logger";
import { DrewlabsV2LoginResultHandlerFunc } from "../rxjs/operators/v2/login-response";
import { onAuthenticationResultEffect } from "../rxjs/operators/login-response";
import { Client, ErrorHandler, HTTPErrorState, HTTP_CLIENT } from "../../http";
import { httpHost } from "../../http/helpers";
import { MapToHandlerResponse, mapToHttpResponse } from "../../http/rx";
import { JSObject } from "../../utils";

const initalState: AuthState = {
  isLoggedIn: false,
  is2FactorAuthActive: false,
  isInitialState: true,
  authenticating: false,
  user: undefined,
  token: undefined,
};

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  // tslint:disable-next-line: variable-name
  private _destroy$ = createSubject<void>();
  // tslint:disable-next-line: variable-name
  private _logoutSubject$ = createSubject<boolean>();

  public readonly logoutState$ = this._logoutSubject$.asObservable();

  // tslint:disable-next-line: variable-name
  private _authStore$ = createStore(authReducer, {
    authenticating: false,
    isInitialState: undefined,
  } as AuthState);

  // Auth state
  state$ = this._authStore$
    .connect()
    .pipe(filter((state) => !JSObject.isEmpty(state)));

  /**
   * @deprecated
   */
  user = this.userStorage.user as
    | IAppUser
    | Authorizable
    | NotifiableUserDetails;

  constructor(
    public userStorage: UserStorageProvider,
    private oAuthTokenProvider: AuthTokenService,
    private rememberTokenProvider: AuthRememberTokenService,
    @Inject(HTTP_CLIENT) private httpClient: Client & ErrorHandler,
    private sessionStorage: SessionStorage,
    private router: Router,
    @Inject("LOGIN_RESPONSE_HANDLER_FUNC")
    private loginResponseHandlerFunc: MapToHandlerResponse<any>,
    @Inject("AUTH_SERVER_HOST") private host: string,
    @Inject("AUTH_LOGIN_PATH") private loginPath: string,
    @Inject("AUTH_LOGOUT_PATH") private logoutPath: string
  ) {
    // Initialize authentication state
    this.initState();
    merge(
      this.httpClient.errorState$,
      observableOf({} as HTTPErrorState).pipe(
        delay(0),
        tap((state) => {
          if (isDefined(state.status)) {
            if (state && state.status === 401) {
              this.userStorage.removeUserFromCache();
              this.oAuthTokenProvider.removeToken();
              this.sessionStorage.clear();
              this.signoutState();
              this.sessionStorage.set("X_SESSION_EXPIRED", true);
              // To be review
              this.router.navigate([AuthPathConfig.LOGIN_PATH], {
                replaceUrl: true,
              });
            }
          }
        }),
        takeUntil(this._destroy$)
      )
    ).subscribe();

    this.logoutState$
      .pipe(
        takeUntil(this._destroy$),
        tap(() => {
          this.userStorage.removeUserFromCache();
          this.oAuthTokenProvider.removeToken();
          this.sessionStorage.clear();
          this.signoutState();
          timeout(() => {
            this.router.navigate([AuthPathConfig.LOGIN_PATH], {
              replaceUrl: true,
            });
          }, 300);
        })
      )
      .subscribe();
  }

  ngOnDestroy = () => {
    this._destroy$.next();
    this._authStore$.destroy();
  };

  public authenticate = (body: ILoginRequest) => {
    authenticatingAction(this._authStore$)();
    return this.httpClient
      .post(`${httpHost(this.host)}/${this.loginPath}`, {
        ...body,
        remember_me: body.remember || false,
      })
      .pipe(
        mapToHttpResponse<ILoginResponse>(
          this.loginResponseHandlerFunc || DrewlabsV2LoginResultHandlerFunc
        ),
        onAuthenticationResultEffect(
          this.userStorage,
          this.oAuthTokenProvider,
          this.rememberTokenProvider,
          body.remember || false
        ),
        mergeMap((source) => {
          authenticationRequestCompletedAction(this._authStore$)({
            isLoggedIn: Boolean(source.isAutenticated),
            is2FactorAuthActive: Boolean(source.is2FactorAuthEnabled),
            isInitialState: false,
            authenticating: false,
            user: this.userStorage.user,
            token: this.oAuthTokenProvider.token,
            rememberToken: this.rememberTokenProvider.token,
          } as AuthState);
          return observableOf(source.loginResponse);
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            return observableOf({
              body: {
                errorMessage: err.statusText,
                responseData: undefined,
                errors: [],
              } as ILoginResponseBody,
              statusCode: err.status,
            } as ILoginResponse);
          }
          return throwError(err);
        })
      );
  };

  public authenticateViaRememberToken = (body: {
    id: string | number;
    token: string;
  }) => {
    authenticatingAction(this._authStore$)();
    return this.httpClient
      .post(`${httpHost(this.host)}/${this.loginPath}/${body.id}`, {
        remember_token: body.token,
      })
      .pipe(
        mapToHttpResponse<ILoginResponse>(
          this.loginResponseHandlerFunc || DrewlabsV2LoginResultHandlerFunc
        ),
        onAuthenticationResultEffect(
          this.userStorage,
          this.oAuthTokenProvider,
          this.rememberTokenProvider,
          false
        ),
        mergeMap((source) => {
          authenticationRequestCompletedAction(this._authStore$)({
            isLoggedIn: Boolean(source.isAutenticated),
            is2FactorAuthActive: Boolean(source.is2FactorAuthEnabled),
            isInitialState: false,
            authenticating: false,
            user: this.userStorage.user,
            token: this.oAuthTokenProvider.token,
            rememberToken: this.rememberTokenProvider.token,
          } as AuthState);
          return observableOf(source.loginResponse);
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            return observableOf({
              body: {
                errorMessage: err.statusText,
                responseData: undefined,
                errors: [],
              } as ILoginResponseBody,
              statusCode: err.status,
            } as ILoginResponse);
          }
          return throwError(err);
        })
      );
  };

  public logout = () => {
    return this.httpClient
      .get(`${httpHost(this.host)}/${this.logoutPath}`)
      .pipe(
        tap(() => {
          this._logoutSubject$.next(true);
        })
      );
  };

  public initState() {
    const user = this.userStorage.user;
    const token = this.oAuthTokenProvider.token ?? undefined;
    const rememberToken = this.rememberTokenProvider.token ?? undefined;
    this.setStateFromStoredValues({ user, token, rememberToken });
  }

  private signoutState() {
    const payload = {
      isLoggedIn: false,
      is2FactorAuthActive: false,
      isInitialState: true,
      user: undefined,
      token: undefined,
      rememberToken: undefined,
      signingOut: true,
    } as AuthState;
    intitAuthStateAction(this._authStore$)(payload);
  }

  private setStateFromStoredValues(state: Partial<AuthStorageValues>) {
    try {
      let payload = {};
      if (state.user && state.token) {
        payload = {
          ...state,
          isLoggedIn: Boolean(true),
          is2FactorAuthActive: Boolean(
            (state.user as IAppUser).is2FactorAuthActive
          ),
          isInitialState: true,
        };
      } else {
        payload = {
          isLoggedIn: false,
          is2FactorAuthActive: false,
          isInitialState: true,
          user: undefined,
          token: undefined,
          rememberToken: undefined,
        } as AuthState;
      }
      intitAuthStateAction(this._authStore$)(payload);
    } catch (error) {
      Log("Error during initialization...", error);
    }
  }

  getAuthorizationToken = () => this.oAuthTokenProvider.token;
}
