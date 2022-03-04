import { HttpErrorResponse } from '@angular/common/http';
import { IEntityServiceProvider } from '../../contracts/entity-service-provider';
export interface HttpServices extends IEntityServiceProvider {
  /**
   * @description Handle HTTP request Error event
   * @param error Http Error response [[HttpErrorResponse]]
   */
  handleError(error: HttpErrorResponse): any;
}
