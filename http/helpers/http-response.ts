import { isDefined } from '../../utils/types/type-utils';
import { IHttpResponse } from '../contracts/types';
import * as lodash from 'lodash';

/**
 * @description Utilities function for getting exact response data from an IHttpReponse data property
 * @param state [[IHttpResponse]]
 */
export const getResponseDataFromHttpResponse = (state: IHttpResponse<any> | any, innerKey = 'data') => {
  return (isDefined(state.data) &&
    (lodash.isObject(state.data) && state.data.hasOwnProperty(innerKey))) ?
    state.data[innerKey] : state.data;
};


/**
 * @description Utilities function for getting exact response data from an IHttpReponse data property
 * @param state [[IHttpResponse]]
 */
export const getResponseV2DataFromHttpResponse = (state: IHttpResponse<any>) => {
  const { data } = isDefined(state.data) && (isDefined(state.data.data)) ? state.data : state;
  return data;
};
