
import { MapToHandlerResponse, HandlerResult } from '../../../types';
import { LoginResponse, ILoginResponse } from '../../../../auth/contracts/v2/login.response';
import { GenericUndecoratedSerializaleSerializer } from '../../../../built-value/core/js/serializer';

/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV2LoginResultHandlerFunc: MapToHandlerResponse<ILoginResponse> = (response: any) => ({
  data: (new GenericUndecoratedSerializaleSerializer<LoginResponse>()).fromSerialized(LoginResponse, response)
} as HandlerResult<LoginResponse>)


/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV2_1LoginResultHandlerFunc = <T>(blueprint: new () => T) => {
  return function (response: any) {
    return ({
      data: (new GenericUndecoratedSerializaleSerializer<T>()).fromSerialized(blueprint, response)
    } as HandlerResult<T>);
  }
}