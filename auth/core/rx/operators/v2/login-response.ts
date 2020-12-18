
import { MapToHandlerResponse, HandlerResult } from '../../../../../rxjs/types';
import { LoginResponse, ILoginResponse } from '../../../../contracts/v2/login.response';
import { GenericUndecoratedSerializaleSerializer } from '../../../../../built-value/core/js/serializer';

/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV2LoginResultHandlerFunc: MapToHandlerResponse<ILoginResponse> = (response: any) => {
  return ({
    data: (new GenericUndecoratedSerializaleSerializer<LoginResponse>()).fromSerialized(LoginResponse, response)
  } as HandlerResult<LoginResponse>);
};
