import { IAuthTokenHandler, IRememberTokenHandler } from '../../../../auth-token/contracts';
import { Observable } from 'rxjs';
import { HandlerResult } from '../../../../rxjs/types';
import { ILoginResponse, IAppUser } from '../../../contracts/v2';
import { LoginResponse, ILoginState } from '../../../contracts/v2/login.response';
import { getResultData } from '../../../../http/contracts/types';
import { responseStatusOK } from '../../../../http/core/helpers';
import { IUserStorageHandler } from '../../../contracts/v2/user/storage-user';
import { map } from 'rxjs/operators';
import { LoginReponseHandlerFunc, LoginResponseWithAuthenticationResult } from '../types';

/**
 * @description Get the login response data structure from the {@link HandlerResult} instance
 * @param result Login result|response instance
 */
export const getLoginResponse: getResultData<ILoginResponse> = (result: HandlerResult<ILoginResponse>) => result.data;

/**
 * @description Get the login state data from user login response object
 * @param loginResponse Login result|response instance
 */
export const getLoginState: (loginResponse: ILoginResponse) => ILoginState =
  (loginResponse: LoginResponse) => loginResponse.body.responseData.loginState;

/**
 * @description Helper method for checking the login result was successful
 * @param loginResponse Instance of the {@link ILoginResponse}
 */
export const drewlabsIsAuthenticationSuccessful: (loginResponse: ILoginResponse) => boolean =
  (loginResponse: ILoginResponse) => loginResponse.success && responseStatusOK(loginResponse.statusCode);

/**
 * @description Checks user has double authentication activated on his account
 * @param loginState Login state instance
 */
export const isDoubleAuthActive: (loginState: ILoginState) => boolean =
  (loginState: ILoginState) => loginState.is2FactorAuthenticationEnabled;

/**
 * @description Get logged in user from the login reponse parameter
 * @param loginResponse Login result|response instance
 */
export const getLoggedInUser: (loginResponse: ILoginResponse) => IAppUser =
  (loginResponse: LoginResponse) => loginResponse.body.responseData.user;

export const onAuthenticationResultEffect: LoginReponseHandlerFunc<LoginResponseWithAuthenticationResult> = (
  userStorageHandler: IUserStorageHandler, tokenProvider: IAuthTokenHandler, rememberProvider: IRememberTokenHandler, remember = false) => {
  return (source$: Observable<any>) => {
    return source$.pipe(
      map(state => {
        let is2FactorAuthEnabled = false;
        let isAutenticated = false;
        const loginResponse = getLoginResponse(state);
        if (drewlabsIsAuthenticationSuccessful(loginResponse)) {
          isAutenticated = true;
          // Check if is double authentication active
          const loginState = getLoginState(loginResponse);
          if (!isDoubleAuthActive(loginState)) {
            is2FactorAuthEnabled = false;
            // Put user details to into app local storage
            tokenProvider.setToken(loginState.token);
            const authenticatedUser = getLoggedInUser(loginResponse);
            if (Boolean(remember)) {
              rememberProvider.setToken({ userId: authenticatedUser.id, token: authenticatedUser.rememberToken });
            }
            userStorageHandler.addUserToCache(authenticatedUser);
          } else {
            is2FactorAuthEnabled = true;
          }
        }
        return { is2FactorAuthEnabled, isAutenticated, loginResponse };
      })
    );
  };
};
