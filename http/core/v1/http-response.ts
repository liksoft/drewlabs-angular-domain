import { IHttpResponse, TransformResponseHandlerFn } from '../../contracts';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';
import { isDefined } from '../../../utils';
import {
  IHttpResourceResponse,
  IHttpResourceResponseBody,
  IHttpResponseData, IV1HttpResourceResponse
} from '../../contracts/response';

export class V1HttpResourceResponse implements IV1HttpResourceResponse {
  data!: IHttpResourceResponse;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      data: { name: 'data', type: V1HttpResourceResponseContent }
    } as { [index: string]: keyof V1HttpResourceResponse } | { [index: string]: any };
  }
}

export class V1HttpResourceResponseContent implements IHttpResourceResponse {
  body!: IHttpResourceResponseBody;
  statusCode!: number;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      body: { name: 'body', type: V1HttpResourceResponseBody },
      code: 'statusCode'
    } as { [index: string]: keyof V1HttpResourceResponseContent } | { [index: string]: any };
  }
}

export class V1HttpResourceResponseBody implements IHttpResourceResponseBody, IHttpResponseData {
  errorMessage!: string;
  responseData!: any;
  errors!: any[];

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      error_message: 'errorMessage',
      response_data: { name: 'responseData' },
      errors: 'errors'
    } as { [index: string]: keyof V1HttpResourceResponseBody } | { [index: string]: any };
  }

  getContent = () => this.responseData;
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
    data: (httpResponse.body as V1HttpResourceResponseBody).getContent(),
    errors: httpResponse.body.errors || null
  } as IHttpResponse<any>;
};
