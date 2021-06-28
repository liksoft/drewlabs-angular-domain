import { Injectable, Inject } from '@angular/core';
import { IAppStorage } from '../contracts/store-interface';
import { storageEntry } from '../../utils';

/**
 * @description InMemory data storage class for saving temporary data
 */
@Injectable()
export class InMemoryStoreService implements IAppStorage {

  private appStore: {[index: string]: any};


  constructor(@Inject('APP_SECRET') private secret: string) {
    this.appStore = new Object();
  }

  /**
   * @description Getter du in memory store
   * @return Return store container [[object]]
   */
  get store(): {[index: string]: any} {
    return this.appStore;
  }

  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  public get(key: string): any {
    return this.appStore[storageEntry(key, this.secret)];
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  public set(key: string, value: any): void {
    this.appStore[storageEntry(key, this.secret)] = value;
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  public delete(key: string): void {
    this.appStore[storageEntry(key, this.secret)] = null;
  }
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  public clear(): void {
    this.appStore = new Object();
  }
}
