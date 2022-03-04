import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IHttpService {

  /**
   * @description Send a request to an end server with HTTP POST verb
   * @param path Request path [[string]]
   * @param body Request body [[object]]
   * @param fullpath Specifies if full url is passed or not
   * @param options Request options including HTTP headers [[object]]
   */
  post( path: string, body: any, options?: any): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP GET verb
   * @param path Request path [[string]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullpath Specifies if full url is passed or not
   */
  get(path: string, options?: any): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP PUT verb
   * @param path Request path [[string]]
   * @param body Request body [[object]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullpath Specifies if full url is passed or not
   */
  put( path: string, body: any, options?: any): Observable<any>;

  /**
   * @description Send a request to an end server with HTTP DELETE verb
   * @param path Request path [[string]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullpath Specifies if full url is passed or not
   */
  delete(path: string, options?: any): Observable<any>;

  /**
   * @description Handle HTTP request Error event
   * @param error Http Error response [[HttpErrorResponse]]
   */
  handleError(error: HttpErrorResponse): any;
}
