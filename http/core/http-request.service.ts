import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServices } from '../contracts/http-services';
import { HttpRequestConfigs } from './config';
import { SessionStorage } from '../../storage/core/session-storage.service';
import { AuthPathConfig, AuthStorageConfig } from '../../auth/core/config';
import { AuthTokenService } from '../../auth-token/core';
import { URLUtils } from '../../utils/url';
import { Browser } from '../../utils/browser';

@Injectable()
export class HttpRequestService implements HttpServices {
  constructor(
    public http: HttpClient,
    private router: Router,
    private sessionStorage: SessionStorage,
    private tokenServiceProvider: AuthTokenService
  ) {}

  /**
   * @description Send a request to an end server with HTTP POST verb
   * @param path Request path [[string]]
   * @param body Request body [[object]]
   * @param fullUrl Specifies if full url is passed or not
   * @param options Request options including HTTP headers [[object]]
   */
  post(
    path: string,
    body: any,
    options?: any,
    fullUrl: boolean = false
  ): Observable<any> {
    const url = URLUtils.isWebURL(path) ? `${path}` : `${HttpRequestConfigs.serverUrl}${path}`;
    return this.http.post(url, body, options).pipe(
      // retry(1),
      catchError((err, res) => this.handleError(err))
    );
  }

  /**
   * @description Send a request to an end server with HTTP GET verb
   * @param path Request path [[string]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullUrl Specifies if full url is passed or not
   */
  get(
    path: string,
    options?: any,
    fullUrl: boolean = false
  ): Observable<any> {
    const url = URLUtils.isWebURL(path) ? `${path}` : `${HttpRequestConfigs.serverUrl}${path}`;
    return this.http.get(url, options).pipe(
      // retry(1),
      catchError((err, res) => this.handleError(err))
    );
  }

  /**
   * @description Send a request to an end server with HTTP PUT verb
   * @param path Request path [[string]]
   * @param body Request body [[object]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullUrl Specifies if full url is passed or not
   */
  put(
    path: string,
    body: any,
    options?: any,
    fullUrl: boolean = false
  ): Observable<any> {
    const url = URLUtils.isWebURL(path) ? `${path}` : `${HttpRequestConfigs.serverUrl}${path}`;
    return this.http.put(url, body, options).pipe(
      // retry(1),
      catchError((err, res) => this.handleError(err))
    );
  }

  /**
   * @description Send a request to an end server with HTTP DELETE verb
   * @param path Request path [[string]]
   * @param options Request options including HTTP headers [[object]]
   * @param fullUrl Specifies if full url is passed or not
   */
  delete(
    path: string,
    options?: any,
    fullUrl: boolean = false
  ): Observable<any> {
    const url = URLUtils.isWebURL(path) ? `${path}` : `${HttpRequestConfigs.serverUrl}${path}`;
    return this.http.delete(url, options).pipe(
      // retry(1),
      catchError((err, res) => this.handleError(err))
    );
  }

  /**
   * @description Handle HTTP request Error event
   * @param error Http Error response [[HttpErrorResponse]]
   */
  handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (+error.status === 401) {
        this.sessionStorage.clear();
        this.tokenServiceProvider.removeToken();
        this.sessionStorage.set(HttpRequestConfigs.sessionExpiredStorageKey, true);
        this.router.navigate([AuthPathConfig.LOGIN_PATH], {
          replaceUrl: true
        });
        // return throwError(HttpRequestMessages.getSessionExpiredMessage());
        return throwError('Error');
      }
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user friendly error message
    return throwError('Error');
  }

  public defaultHttpHeaders(): HttpHeaders {
    const httpHeader = new HttpHeaders();
    httpHeader.append('Content-Type', 'application/json');
    return httpHeader;
  }

  /**
   * @description provide a file download functionnality to the application
   * @param url [[string]]
   */
  downloadFile(url: string) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'text/plain');
    headers.append('Content-type', 'application/octet-stream');
    this.http
      .get(url, { headers, responseType: 'blob' })
      .toPromise()
      .then((res: any) => {
        const filename = this.getFileNameFromResponseContentDisposition(res);
        Browser.saveFile(res, filename);
      });
  }

  /**
   * Derives file name from the http response by looking inside content-disposition
   * @param res http Response
   */
  getFileNameFromResponseContentDisposition(res: Response) {
    const contentDisposition = res.headers.get('Content-Disposition') || '';
    const matches = /filename=([^;]+)/gi.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').trim();
    return fileName;
  }
}
