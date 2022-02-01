import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Client {
  /**
   * @description Send a request to an end server with HTTP POST verb
   * @param path
   * @param body
   * @param options
   */
  post(
    path: string,
    body: any,
    options?: { [index: string]: any }
  ): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP GET verb
   * @param path
   * @param options
   */
  get(path: string, options?: { [index: string]: any }): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP PUT verb
   * @param path
   * @param body
   * @param options
   * @param fullpath Specifies if full url is passed or not
   */
  put(
    path: string,
    body: any,
    options?: { [index: string]: any }
  ): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP DELETE verb
   * @param path
   * @param options
   */
  delete(path: string, options?: { [index: string]: any }): Observable<any>;

  /**
   * @description Handle HTTP request Error event
   * @param error Http Error response [[HttpErrorResponse]]
   */
  handleError(error: HttpErrorResponse): any;
}

export interface BinaryHttpClient {
  /**
   * @description provide a file download functionnality to the application
   * @param url
   * @param filename
   * @param extension
   * @param params
   */
  download(
    url: string,
    name?: string,
    ext?: string,
    params?: { [prop: string]: any }
  ): Observable<any>;

  /**
   * Read the HTTP response as a binary stream {@see Blob}
   *
   * @param url
   * @param params
   * @returns
   */
  readBinaryStream(
    url: string,
    params?: { [prop: string]: any }
  ): Observable<any>;
}
