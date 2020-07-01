import { ResponseData } from '../contracts/http-response-data';

/**
 * @description Helper method to check if request completed successfully
 */
export function requestHasCompletedSuccessfully(responseData: ResponseData) {
  return responseData.success;
}
