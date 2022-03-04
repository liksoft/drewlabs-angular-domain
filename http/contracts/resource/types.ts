import { IHttpResponse } from '../types';

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
export type TransformManyResponseHandlerFn<T> = (response: any) => IHttpResponse<T[]>;
