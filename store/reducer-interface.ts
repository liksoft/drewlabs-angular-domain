import { EventEmitter } from '@angular/core';
import { IAction } from './action-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';

export interface IReducer<T> {

  items: BehaviorSubject<List<T>>;
  /**
   * @description Initialize current store
   */
  setInitState(): IReducer<T>;
  /**
   * @description Set the store dispatcher on the reducer
   * @param e [[EventEmitter]]
   */
  setDispatcher(e: EventEmitter<IAction>): IReducer<T>;

  /**
   * @description Get the list of items in the store
   */
  values(): Observable<List<T>>;
  /**
   * @description Reset the reducer. Unsubscribe to all subscription
   */
  reset(): any;
}

export abstract class AbstractReducersService<T> {
  /**
   * @description Build a list of Application reducers
   */
  public abstract initializeApplicationReducers(): { [index: string]: IReducer<T> };
}
