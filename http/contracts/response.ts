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

export enum HttpResponseStatusCode {
  STATUS_OK = 200 || 201,
  STATUS_CREATED = 201,
  BAD_REQUEST = 422 || 400,
  SERVER_ERROR = 500,
  UNKNOWN = 0,
  UNAUTHORIZED = 401
}
