import { IHttpResponse } from '../contracts';

export class HttpResult implements IHttpResponse<any> {
  statusCode: number = undefined;
  statusMessage?: string = undefined;
  errors?: object | string[] = undefined;
  errorMessage?: string = undefined;
  data: any = undefined;

}


export enum DrewlabsHttpResponseStatusCode {
  STATUS_OK = 200,
  STATUS_CREATED = 201,
  BAD_REQUEST = 422,
  SERVER_ERROR = 500,
  UNKNOWN = 0,
  UNAUTHORIZED = 401
}
