import { Observable, Subject, Subscriber, TeardownLogic, BehaviorSubject, OperatorFunction } from 'rxjs';
import { IUserStorageHandler } from '../auth/contracts/v2/user/storage-user';
import { IAuthTokenHandler, IRememberTokenHandler } from '../auth-token/contracts';
import { ILoginResponse } from '../auth/contracts/v2';

// Creates a new observable subject
export type GenericCreateSubjectFunc<T> = (param?: T) => Subject<T> | BehaviorSubject<T>;
/**
 * @description Type definition for parameter passed to createObservable function
 */
export type GenericObserverHandlerFunc<T> = (subscriber: Subscriber<T>) => TeardownLogic;

/**
 * @description Create observable type definition
 */
export type GenericCreateObservableFunc<T> = (handler?: GenericObserverHandlerFunc<T>) => Observable<T>;

/**
 * @description Type definition for method mapping any response type to the IHttpReponse
 */
export type MapToHandlerResponse<T> = (res: any) => HandlerResult<T>;

export type mapToHttpResponseFunc<T> = (handlerFn: MapToHandlerResponse<T>)
  => (source$: Observable<any>) => Observable<HandlerResult<T>>;

export interface LoginResponseWithAuthenticationResult {
  is2FactorAuthEnabled: boolean;
  isAutenticated: boolean;
  loginResponse: ILoginResponse;
}

export type LoginReponseHandlerFunc<T extends LoginResponseWithAuthenticationResult> = (
  userStorageHandler: IUserStorageHandler, tokenProvider: IAuthTokenHandler, rememberProvider: IRememberTokenHandler, remember?: boolean)
  => OperatorFunction<any, T>;
/**
 * @description Type definition for result of a given handler function
 */
export interface HandlerResult<T> {
  data: T;
}
