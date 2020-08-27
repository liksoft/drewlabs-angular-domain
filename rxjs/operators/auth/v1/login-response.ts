import { HandlerResult, MapToHandlerResponse } from '../../../types';
import { GenericUndecoratedSerializaleSerializer } from '../../../../built-value/core/js/serializer';
import { LoginResponse } from '../../../../auth/contracts/v2/login.response';
import { isDefined } from '../../../../utils/types/type-utils';
import { Log } from '../../../../utils/logger';

/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV1LoginResultHandlerFunc: MapToHandlerResponse<any> = (response: any) => {
  response = isDefined(response.data) ? response.data : response;
  Log('Login response : ', response);
  return ({
    data: (new GenericUndecoratedSerializaleSerializer<LoginResponse>()).fromSerialized(LoginResponse, response)
  } as HandlerResult<LoginResponse>);
};

