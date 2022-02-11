import { IHttpResourceResponse, IHttpResourceResponseBody, IHttpResponseData } from '../../contracts';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';

export class HttpResourceResponse implements IHttpResourceResponse {
  body!: IHttpResourceResponseBody;
  statusCode!: number;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      body: { name: 'body', type: HttpResourceResponseBody },
      code: 'statusCode'
    } as { [index: string]: keyof HttpResourceResponseBody } | { [index: string]: any };
  }
}

class HttpResourceResponseBody implements IHttpResourceResponseBody, IHttpResponseData {
  errorMessage!: string;
  responseData!: IHttpResponseData;
  errors!: any[];

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      error_message: 'errorMessage',
      response_data: { name: 'responseData' },
      errors: 'errors'
    } as { [index: string]: keyof HttpResourceResponseBody } | { [index: string]: any };
  }

  getContent = () => this.responseData;
}

// tslint:disable-next-line: typedef
export function parseV2HttpResponse(response: any) {
  const httpResponse = (new GenericUndecoratedSerializaleSerializer<HttpResourceResponse>()).fromSerialized(HttpResourceResponse, response);
  return {
    errorMessage: httpResponse.body ? (httpResponse.body.errorMessage || null) : null,
    statusCode: httpResponse.statusCode || null,
    data: (httpResponse.body as IHttpResponseData).getContent(),
    errors: httpResponse.body.errors || null
  };
}
