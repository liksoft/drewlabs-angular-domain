import {
  HttpClient as BaseHttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, startWith } from "rxjs/operators";
import { Injectable, Inject } from "@angular/core";
import { URLUtils } from "../../utils/url/url";
import { isDefined } from "../../utils/types/type-utils";
import { createSubject } from "../../rxjs/helpers/index";
import { Err } from "../../utils/logger";
import { ErrorHandler, HTTPErrorState } from "../contracts/error-handler";
import { Client } from "../contracts";
import { writeStream } from "../../utils/io";
import { SERVER_URL } from "../tokens";


const getNameFromResponseHeaders = (res: any) => {
  if (res instanceof Blob) {
    return Math.random().toString(36).substring(2, 15);
  }
  const disposition = res.headers?.get("Content-Disposition") || "";
  const matches = /filename=([^;]+)/gi.exec(disposition) || [];
  return matches?.length === 0 ? undefined : (matches[1] || "untitled").trim();
};

@Injectable()
export class HttpClient implements Client, ErrorHandler {
  // tslint:disable-next-line: variable-name
  private _errorState$ = createSubject<HTTPErrorState>();

  errorState$ = this._errorState$.pipe(startWith({} as HTTPErrorState));

  constructor(
    public http: BaseHttpClient,
    @Inject(SERVER_URL) private host: string
  ) { }

  private wrapURL = (path: string) =>
    URLUtils.isWebURL(path) ? `${path}` : `${this.host}${path}`;

  public post(path: string, body: any, options?: any) {
    return this.http
      .post(this.wrapURL(path), body, options)
      .pipe(catchError((err) => this.handleError(err)));

  }

  public get(path: string, options?: any){
    return this.http
      .get(this.wrapURL(path), options)
      .pipe(catchError((err) => this.handleError(err)));
  }

  public put(path: string, body: any, options?: any) {
    return this.http
      .put(this.wrapURL(path), body, options)
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }


  public delete(path: string, options?: any) {
    return this.http
      .delete(this.wrapURL(path), options)
      .pipe(catchError((err) => this.handleError(err)));
  }


  public download = async (
    url: string,
    name?: string,
    extension?: string,
    options?: { [prop: string]: any }
  ) => (async (response: Blob) => {
    if (!isDefined(name)) {
      name = isDefined(extension)
        ? `${getNameFromResponseHeaders(response)}.${extension}`
        : `${getNameFromResponseHeaders(response)}`;
    }
    await writeStream(
      response,
      isDefined(extension) ? `${name}.${extension}` : `${name}`
    );
  })(await this.readBinaryStream(this.wrapURL(url), options));

  public readBinaryStream = (url: string, params?: { [prop: string]: any }) =>
    (async () => {
      const headers = new HttpHeaders();
      headers.append("Accept", "text/plain");
      headers.append("Content-type", "application/octet-stream");
      return await this.http
        .get(url, { headers, responseType: "blob", params })
        .toPromise();
    })();


  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      Err("An error occurred:", error.error.message);
    } else {
      this._errorState$.next({ status: +error.status, error: error.error, url: error.url ?? undefined });
      Err(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error);
  }
}
