export interface IHttpResourceResponse {
  body?: IHttpResourceResponseBody;
  statusCode: number;
}

export interface IV1HttpResourceResponse {
  data: IHttpResourceResponse;
}


export interface IHttpResourceResponseBody {
  errorMessage: string;
  responseData: IHttpResponseData|any;
  errors: any[];
}

export interface IHttpResponseData {
  /**
   * @description Returns the actual response data returned by the backend server
   */
  getContent(): any;
}

export class HttpResponseStatusCode {
  static readonly STATUS_OK = 200 || 201;
  static readonly STATUS_CREATED = 201;
  static readonly BAD_REQUEST = 422 || 400;
  static readonly SERVER_ERROR = 500;
  static readonly UNKNOWN = 0;
  static readonly UNAUTHORIZED = 401;
}
