import { MapToHandlerResponse } from "../../../../http/rx";
import {
  LoginResponse,
  ILoginResponse,
} from "../../../../auth/contracts/v2/login.response";
import { GenericUndecoratedSerializaleSerializer } from "../../../../built-value/core/js/serializer";
import { HandlerResult } from "../../../../rxjs/types";

/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV2LoginResultHandlerFunc: MapToHandlerResponse<ILoginResponse> =
  (response: any) =>
    ({
      data: new GenericUndecoratedSerializaleSerializer().fromSerialized(
        LoginResponse,
        response
      ),
    } as HandlerResult<ILoginResponse>);

/**
 * @description Parse login response into a {@link LoginResponse} instance
 * @param response Login response from the backend
 */
export const DrewlabsV2_1LoginResultHandlerFunc = <T>(
  blueprint: new () => T
) => {
  return function (response: any) {
    const result = {
      data: new GenericUndecoratedSerializaleSerializer<T>().fromSerialized(
        blueprint,
        response
      ),
    } as HandlerResult<T>;
    return result;
  };
};
