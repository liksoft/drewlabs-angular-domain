import { Collection } from '../../utils/collection';

export class ResponseErrorBag extends Collection<string> {
  public errors() {
    return this.values();
  }
}

export interface IResponseBody {
  data: any;
  errors?: any;
  errorMessages?: string;
  responseStatusCode?: number;
}

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
}

export interface ResponseData {
  success: boolean;
  body: ResponseBody;
  code: number;
}
