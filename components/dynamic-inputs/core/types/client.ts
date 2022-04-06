import { Observable } from 'rxjs';
import { SelectableControlItems } from './items';

export interface SelectOptionsClient {
  //
  /**
   * @description Query list of select options from forms provider database
   *
   */
  getOptions(params: string | any[]): Observable<SelectableControlItems[]>;
}
