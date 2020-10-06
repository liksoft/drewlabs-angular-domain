export interface IHttpResourceResponse {
  success: boolean;
  body: IHttpResourceResponseBody;
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
  getData(): any;
}
