import { EventEmitter } from '@angular/core';
import { List } from 'immutable';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { IEntity } from '../entity';
import { IReducer, IAction } from '.';
import { Collection } from '../utils/collection';
import { ICollection } from '../contracts/collection-interface';
import { Items } from '@clr/angular/data/datagrid/providers/items';

export interface IPayload {
  index?: string;
  needle?: any;
  value?: any;
}

/**
 * @description Apply operations on the reducer that is being passed in
 * @param reducer [[IReducer]]
 * @param action [[T]]
 */
export type ReducerHandlerFn<T extends IPayload, K> = (reducer: IReducer<K>, action: T) => void;

/**
 * @description Take is list of [[T]], apply required transformations on it and return a new list
 * @param items [[List<T>]]
 */
export function initializeStoreHandler<T>(items: List<T>): List<T> {
  return items;
}

/**
 * @description Remove and item from a [[List<T>]] and return the spliced list of items
 * @param items [[List<T>]]
 * @param key [[number|string]]
 * @param needle [[any]]
 */
export function removeByKeyHandler<T>(items: List<T>, key: number | string, needle: any): List<T> {
  return items.splice(
    this.items.getValue().findIndex((value: T) => value[key] === needle),
    1
  )
    .toList();
}

/**
 * @description Add an item to a [[List<T>]] and return the updated list
 * @param items [[List<T>]]
 * @param item [[T]]
 */
export function addToStoreHandler<T>(items: List<T>, item: T): List<T> {
  return items.push(item);
}

/**
 * @description Update an item in a [[List<T>]] based on a key
 * @param items [[List<T>]]
 * @param key [[string]]
 * @param needle [[any]]
 * @param newVal [[object]]
 */
export function updateEntityByKeyHandler<T extends IEntity>(items: List<T>, key: number | string, needle: any, newVal: object): List<T> {
  const index = items.findIndex((value: T) => value[key] === needle);
  const item = items.get(index);
  item.fromEntries(newVal);
  return items.set(index, item);
}

export abstract class AbstractReducer<T> implements IReducer<T> {
  public items: BehaviorSubject<List<T>>;
  protected event: EventEmitter<IAction>;
  protected handlers: ICollection<ReducerHandlerFn<IPayload, T>> = new Collection();
  private eventSubscription: Subscription;

  /**
   * @description Store object initializer
   */
  constructor(handlers: { [index: string]: ReducerHandlerFn<IPayload, T> }) {
    Object.keys(handlers).forEach((k: string) => {
      this.handlers.add(k, handlers[k]);
    });
  }

  /**
   * @inheritdoc
   * @param e [[EventEmitter<IAction>]]
   */
  public setDispatcher(e: EventEmitter<IAction>): IReducer<T> {
    this.event = e;
    this.eventSubscription = this.event.subscribe((action: IAction) => {
      this.onStream(action);
    });
    return this;
  }

  protected abstract onStream(action: IAction): any;

  /**
   * @inheritdoc
   */
  public setInitState(): IReducer<T> {
    this.items = new BehaviorSubject(null);
    return this;
  }


  /**
   * @inheritdoc
   */
  public values(): Observable<List<T>> {
    return this.items.asObservable();
  }

  /**
   * @inheritdoc
   */
  public reset(): any {
    this.items.complete();
    this.eventSubscription.unsubscribe();
  }
}


export abstract class AbstractEntityReducer<T extends IEntity> extends AbstractReducer<T> implements IReducer<IEntity> {

}
