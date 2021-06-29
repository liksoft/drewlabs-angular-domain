import { statusOk } from '../contracts/types';
import { DrewlabsHttpResponseStatusCode } from './http-response';

/**
 * @description Checks if the request response status code equals HTTP OK status code
 * @param statusCode Reponse status code
 */
export const responseStatusOK: statusOk = (statusCode: number | string) => String(statusCode) === '200' || String(statusCode) === '201';

/**
 * Checks if an HTTP  Status code is a bad request
 * @param id Htt status code
 * @returns 
 */
export const isBadRequest = (id?: number|string) => [DrewlabsHttpResponseStatusCode.BAD_REQUEST, 400].includes(+(id || ''));

/**
 * Checks if an HTTP Status code is a server Error status code
 * @param id Htt status code
 * @returns 
 */
 export const isServerError = (id?: number|string) => [DrewlabsHttpResponseStatusCode.SERVER_ERROR].includes(+(id || ''));