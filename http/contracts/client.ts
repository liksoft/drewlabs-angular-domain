import { Observable } from "rxjs";

export interface Client {
  /**
   * @description Send a request to an end server with HTTP POST verb
   */
  post(
    path: string,
    body: any,
    options?: { [index: string]: any }
  ): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP GET verb
   */
  get(path: string, options?: { [index: string]: any }): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP PUT verb
   */
  put(
    path: string,
    body: any,
    options?: { [index: string]: any }
  ): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP DELETE verb
   */
  delete(path: string, options?: { [index: string]: any }): Observable<any>;
}

export interface BinaryHttpClient {
  /**
   * @description provide a file download functionnality to the application
   */
  download(
    url: string,
    name?: string,
    ext?: string,
    params?: { [prop: string]: any }
  ): Observable<any>;

  /**
   * @description Read the HTTP response as a binary stream {@see Blob}
   */
  readBinaryStream(
    url: string,
    params?: { [prop: string]: any }
  ): Observable<any>;
}
