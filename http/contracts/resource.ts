import { HttpErrorResponse } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { UIStateStatusCode } from "../../ui-state";
import { ErrorHandler } from "./error-handler";
import { IHttpResponse } from "./types";

/**
 * @description Provides a unified defining the structure of an object that can be used for creating a given entity
 */
export type RequestBody = object[] | object | any;

/**
 * @description Provides a unifined method definition for the transforming a response into {@link IHttpResponse} type
 */
export type TransformResponseHandlerFn = (response: any) => IHttpResponse<any>;

/**
 * @description Provides a unifined method definition for the transforming a response into a list of {@link IHttpResponse} type
 */
export type TransformManyResponseHandlerFn<T> = (
  response: any
) => IHttpResponse<T[]>;

/**
 * Provides an unified interface definition for working with a storage entity of a given type
 */
export interface IResourcesServerClient<T extends IHttpResponse<any>>
  extends ErrorHandler {
  /**
   * @description Add a new entity with the provided attributes to the entity collection/store
   * @param path path to the server resource
   * @param body request body object
   * @param params request query parameters
   */
  create(path: string, body: RequestBody, params?: object): Observable<T>;

  /**
   * @description Get list of entities from the data source (collection/store)
   * @param path path to the server resource
   * @param params request query parameters
   */
  get(path: string, params?: object): Observable<T>;

  /**
   * @description Get an entity from the data source using the entity identifier
   * @param path path to the server resource
   * @param id resource unique identifier
   * @param params request query parameters
   */
  getUsingID(
    path: string,
    id: string | number,
    params?: object
  ): Observable<IHttpResponse<T>>;

  /**
   * @description Modidy/Patch details of enities matching parameters passed to options parameters
   * @param path path to the resource server
   * @param body request body object
   * @param params request query parameters
   */
  update(path: string, body: any, params?: object): Observable<T>;

  /**
   * @description Modidy/Patch details of enities matching parameters passed to options parameters
   * @param path path to the resource server
   * @param id resource unique identifier
   * @param body request body object
   * @param params request query parameters
   */
  updateUsingID(
    path: string,
    id: string | number,
    body: RequestBody,
    params?: object
  ): Observable<T>;

  /**
   * @description Removes a list of entities from the data storage based on the provided parameters
   * @param path path to the resource server
   * @param body request body object
   * @param params request query parameters
   */
  delete(path: string, params: object): Observable<T>;

  /**
   * @description Remove/Delete an entity from the data storage using the provided entity's ID
   * @param path path to the resource server
   * @param id request body object
   * @param params request query parameters
   */
  deleteUsingID(
    path: string,
    id: string | number,
    params?: object
  ): Observable<T>;

  /**
   * @description Convert HTTP Error response error object into an HTTpResponse onbject
   * @param error Erro object
   */
  handleErrorResponse(
    error: HttpErrorResponse
  ):
    | HttpErrorResponse
    | { status: UIStateStatusCode; validationErrors: { [prop: string]: any } };
}
