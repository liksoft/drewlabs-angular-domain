import { IHttpResourceResponse, IHttpResponseData } from '../../contracts/http-response';
import { GenericUndecoratedSerializaleSerializer } from '../../../built-value/core/js/serializer';

export class HttpResourceResponse implements IHttpResourceResponse, IHttpResponseData {

  success: boolean = undefined;
  statusCode: number = undefined;
  errorMessage: string = undefined;
  responseData: IHttpResponseData = undefined;
  errors: any[] = undefined;

  getData = () => this.responseData;

  // Static method definition for attribute parsing
  // tslint:disable-next-line: typedef
  static getJsonableProperties() {
    return {
      success: 'success',
      code: 'statusCode',
      error_message: 'errorMessage',
      response_data: { name: 'responseData' },
      errors: 'errors'
    } as { [index: string]: keyof IHttpResourceResponse & IHttpResponseData } | { [index: string]: any };
  }
}

// tslint:disable-next-line: typedef
export function parseV3HttpResponse(response: any) {
  const httpResponse = (new GenericUndecoratedSerializaleSerializer<HttpResourceResponse>()).fromSerialized(HttpResourceResponse, response);
  return {
    errorMessage: httpResponse.errorMessage,
    statusCode: httpResponse.statusCode || null,
    data: httpResponse.getData(),
    errors: httpResponse.errors || null
  };
}
