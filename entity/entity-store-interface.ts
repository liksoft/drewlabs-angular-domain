import { IEntity } from './entity-interface';
import {List} from 'immutable';
import { Observable } from 'rxjs';

export interface IEntityReducer<T> {
  // /**
  //  * @description Set the store items
  //  * @param items [[List<IEntity>]] List of store items
  //  */
  // set(items: List<IEntity>): void;
  // /**
  //  * @description Push an item to the list of items
  //  * @param item [[IEntity]] item
  //  */
  // push(entity: IEntity): void;
  /**
   * @description Get the list of items in the store
   */
  values(): Observable<List<T>>;
  // /**
  //  * @description Remove an item from the store
  //  * @param key [[string]] The properti of [[T]] to match against
  //  * @param needle [[any]]
  //  */
  // remove(key: string, needle: any): void;
  // /**
  //  * @description Update an item in the store
  //  * @param key [[string]] The properti of [[T]] to match against
  //  * @param needle [[any]]
  //  * @param newVal update values object
  //  */
  // update(key: string, needle: any, newVal: object): void;
}
