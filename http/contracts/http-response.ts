export interface IHttpResponse<T extends any> {
    data: T;
    statusCode: number;
    statusMessage?: string;
}

/**
 *  @description Returns the response data object contains in the http response
 * @param response [[IHttpResponse<T>]]
 */
export type getResponseData<T> = (response: IHttpResponse<T>) =>  T;

/**
 * @description Returns true if the HTTP request completed sucessfully
 * @param response [[IHttpResponse<any>]]
 */
export type  statusOk = (response: IHttpResponse<any>)  =>  boolean;

/**
 * @description Returns the HTTP response status code
 * @param response [[IHttpResponse<any>]]
 */
export type statusCode = (response: IHttpResponse<any>) => number;

/**
 * @description Returns the status message of the HTTP response
 * @param response [[IHttpResponse<any>]]
 */
export type getStatusMessage = (response: IHttpResponse<any>) => string;

/**
 * @description Type definition for method mapping any response type to the IHttpReponse
 */
export type MapToIHttpResponse<T> = (res: any) => IHttpResponse<T>;
