import { IAction } from 'src/app/lib/domain/store/action-interface';
import { IReducer, AbstractReducersService } from './reducer-interface';
import { Injectable, EventEmitter } from '@angular/core';
import { Collection } from '../utils/collection';

@Injectable()
export class Store<T> extends Collection<IReducer<T>> {
  protected storeDispatcher: EventEmitter<IAction> = new EventEmitter<
    IAction
  >();
  /**
   * @description Store object initializer
   */
  constructor(private reducersService: AbstractReducersService<T>) {
    super();
  }

  public initialize() {
    const reducers = this.reducersService.initializeApplicationReducers();
    for (const prop in reducers) {
      if (!this.contains(prop)) {
        const reducer = reducers[prop]
          .setInitState()
          .setDispatcher(this.storeDispatcher);
        this.add(prop, reducer);
      }
    }
    return this;
  }

  /**
   * @description Dispatch an action to be handle by store reducers
   * @param a [[IAction]] action to handle
   */
  public dispatch(a: IAction) {
    this.storeDispatcher.emit(a);
  }

  /**
   * @description Destroy the store
   */
  public destroy() {
    this.values().forEach((v: IReducer<T>) => v.reset());
    // initialize values
    this.keys().forEach((k: string) => this.remove(k));
  }
}

export const StoreFactory = (service: AbstractReducersService<any>) => {
  return new Store(service);
};
