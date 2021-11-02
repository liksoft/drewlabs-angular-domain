import {
  HttpClient as BaseHttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
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

/**
 * Derives file name from the http response by looking inside content-disposition
 * @param res http Response
 */
const getNameFromResponseHeaders = (res: any) => {
  if (res instanceof Blob) {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  const contentDisposition = res.headers?.get("Content-Disposition") || "";
  const matches = /filename=([^;]+)/gi.exec(contentDisposition) || [];
  const fileName =
    matches?.length === 0 ? undefined : (matches[1] || "untitled").trim();
  return fileName;
};

@Injectable()
export class HttpClient implements Client, ErrorHandler {
  // tslint:disable-next-line: variable-name
  private _errorState$ = createSubject<HTTPErrorState>();

  errorState$ = this._errorState$.pipe(startWith({} as HTTPErrorState));

  constructor(
    public http: BaseHttpClient,
    @Inject(SERVER_URL) private serverUrl: string
  ) {}

  /**
   * {@inheritdoc}
   */
  post(path: string, body: any, options?: any): Observable<any> {
    const url = URLUtils.isWebURL(path)
      ? `${path}`
      : `${this.serverUrl}${path}`;
    return this.http.post(url, body, options).pipe(
      // retry(1),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * {@inheritdoc}
   */
  get(path: string, options?: any): Observable<any> {
    const url = URLUtils.isWebURL(path)
      ? `${path}`
      : `${this.serverUrl}${path}`;
    return this.http.get(url, options).pipe(
      // retry(1),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * {@inheritdoc}
   */
  put(path: string, body: any, options?: any): Observable<any> {
    const url = URLUtils.isWebURL(path)
      ? `${path}`
      : `${this.serverUrl}${path}`;
    return this.http.put(url, body, options).pipe(
      // retry(1),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * {@inheritdoc}
   */
  delete(path: string, options?: any): Observable<any> {
    const url = URLUtils.isWebURL(path)
      ? `${path}`
      : `${this.serverUrl}${path}`;
    return this.http.delete(url, options).pipe(
      // retry(1),
      catchError((err) => this.handleError(err))
    );
  }

  public defaultHttpHeaders(): HttpHeaders {
    const httpHeader = new HttpHeaders();
    httpHeader.append("Content-Type", "application/json");
    return httpHeader;
  }

  /**
   * @description provide a file download functionnality to the application
   * @param url
   * @param filename
   * @param extension
   * @param params
   */
  download = async (
    url: string,
    filename?: string,
    extension?: string,
    params?: { [prop: string]: any }
  ) =>
    (async (response: Blob) => {
      if (!isDefined(filename)) {
        filename = isDefined(extension)
          ? `${getNameFromResponseHeaders(response)}.${extension}`
          : `${getNameFromResponseHeaders(response)}`;
      }
      await writeStream(
        response,
        isDefined(extension) ? `${filename}.${extension}` : `${filename}`
      );
    })(
      await this.readBinaryStream(
        URLUtils.isWebURL(url) ? `${url}` : `${this.serverUrl}${url}`,
        params
      )
    );

  /**
   * Read the HTTP response as a binary stream a.k.a Blob'
   *
   * @param url
   * @param params
   * @returns
   */
  public readBinaryStream = (url: string, params?: { [prop: string]: any }) =>
    (async () => {
      const headers = new HttpHeaders();
      headers.append("Accept", "text/plain");
      headers.append("Content-type", "application/octet-stream");
      const response = await this.http
        .get(url, { headers, responseType: "blob", params })
        .toPromise();
      return response;
    })();

  /**
   * {@inheritdoc}
   */
  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      Err("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this._errorState$.next({
        status: +error.status,
        error: error.error,
        url: error.url || undefined,
      });
      Err(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user friendly error message
    return throwError(error);
  }

  /**
   * @deprecated Use {@link download} method instead
   * @param url
   * @param filename
   * @param fileExtension
   * @param params
   */
  public downloadFile = (
    url: string,
    filename?: string,
    fileExtension?: string,
    params?: { [prop: string]: any }
  ) => this.download(url, filename, fileExtension, params);

  /**
   * @deprecated Use {@link readBinaryStream} method instead
   *
   * @description Load a file from the backend server
   * @param url [[string]]
   */
  public loadServerFile = (url: string, params?: { [prop: string]: any }) =>
    this.readBinaryStream(url, params);
}
