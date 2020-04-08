import {List} from 'immutable';
import { Observable } from 'rxjs';

export interface IEntityReducer<T> {
  /**
   * @description Get the list of items in the store
   */
  values(): Observable<List<T>>;
}
