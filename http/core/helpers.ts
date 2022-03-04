import { isDefined } from '../../utils/types';
import { statusOk } from '../contracts/types';

/**
 * @description Checks if the request response status code equals HTTP OK status code
 * @param statusCode Reponse status code
 */
export const responseStatusOK: statusOk = (statusCode: number | string) => String(statusCode) === '200' || String(statusCode) === '201';