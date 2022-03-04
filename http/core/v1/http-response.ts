import { IHttpResponse, TransformResponseHandlerFn } from '../../contracts';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';
import { isDefined } from '../../../utils';
import { Log } from '../../../utils/logger';
import {
  IHttpResourceResponse,
  IHttpResourceResponseBody,
  IHttpResponseData, IV1HttpResourceResponse
} from '../../contracts/http-response';

export class V1HttpResourceResponse implements IV1HttpResourceResponse {
  data: IHttpResourceResponse;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      data: { name: 'data', type: V1HttpResourceResponseContent }
    } as { [index: string]: keyof V1HttpResourceResponse } | { [index: string]: any };
  }
}

export class V1HttpResourceResponseContent implements IHttpResourceResponse {
  success: boolean = undefined;
  body: IHttpResourceResponseBody = undefined;
  statusCode: number = undefined;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      success: 'success',
      body: { name: 'body', type: V1HttpResourceResponseBody },
      code: 'statusCode'
    } as { [index: string]: keyof V1HttpResourceResponseContent } | { [index: string]: any };
  }
}

export class V1HttpResourceResponseBody implements IHttpResourceResponseBody, IHttpResponseData {
  errorMessage: string = undefined;
  responseData: any = undefined;
  errors: any[] = undefined;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      error_message: 'errorMessage',
      response_data: { name: 'responseData' },
      errors: 'errors'
    } as { [index: string]: keyof V1HttpResourceResponseBody } | { [index: string]: any };
  }

  getData = () => this.responseData;
}

export const parseV1HttpResponse: TransformResponseHandlerFn = (response: any) => {
  const httpResponse = (new GenericUndecoratedSerializaleSerializer<V1HttpResourceResponse>())
    .fromSerialized(V1HttpResourceResponse, response).data;
  if (!isDefined(httpResponse)) {
    return {} as IHttpResponse<any>;
  }
  return {
    errorMessage: httpResponse.body ? (httpResponse.body.errorMessage || null) : null,
    statusCode: httpResponse.statusCode || null,
    data: (httpResponse.body as V1HttpResourceResponseBody).getData(),
    errors: httpResponse.body.errors || null
  } as IHttpResponse<any>;
};
