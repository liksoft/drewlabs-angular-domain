
/**
 * @deprecated
 */
export interface IResponseBody {
  data: any;
  errors?: any;
  errorMessages?: string;
  responseStatusCode?: number;
  statusOK?: boolean;
}
/**
 * @deprecated
 */
export class ResponseBody implements IResponseBody {
  data: any;
  errors?: any;
  errorMessages?: string;
  responseStatusCode?: number;

  /**
   * @description [[ResponseBody]] object initializer
   */
  constructor(val: any) {
    this.data = val.response_data;
    this.errors = val.errors;
    this.errorMessages = val.error_message;
    this.responseStatusCode = val.status;
  }

  get statusOK() {
    return this.responseStatusCode === 200 || this.responseStatusCode === 201;
  }
}

/**
 * @deprecated
 */
export interface ResponseData {
  success: boolean;
  body: ResponseBody;
  code: number;
}
