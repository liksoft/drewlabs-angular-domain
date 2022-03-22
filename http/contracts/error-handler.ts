import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseStatusCode } from "./types";

export interface HTTPErrorState {
  status: number;
  error?: any;
  url?: string;
}

export interface ErrorHandler {

  errorState$: Observable<HTTPErrorState>;

  /**
   * @description Convert HTTP Error response error object into an HTTpResponse onbject
   */
  handleError(error: HttpErrorResponse): HttpErrorResponse | {
    status: ResponseStatusCode,
    validationErrors: { [prop: string]: any }
  } | Observable<never>;
}
