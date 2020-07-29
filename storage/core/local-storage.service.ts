import { Injectable, Inject } from '@angular/core';
import { IAppStorage, SecureWebStorage, SecureStorage,  } from '../contracts/store-interface';
import { storageEntry } from '../../utils';

/**
 * @description Browser local storage class for saving data
 */
@Injectable()
export class LocalStorage implements IAppStorage {
  /**
   * @description Browser LocalStorage Object
   * @var {Storage}
   */
  private store: SecureStorage;

  constructor(@Inject('APP_SECRET') private secret: string) {
    this.store = this.initStorage();
  }

  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  get(key: string): any {
    return JSON.parse(this.store.getItem(storageEntry(key, this.secret)));
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  set(key: string, item: any): void {
    this.store.setItem(storageEntry(key, this.secret), JSON.stringify(item));
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  delete(key: string): void {
    this.store.removeItem(storageEntry(key, this.secret));
  }
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  clear(): void {
    this.store.clear();
  }
  /**
   * @description Initialize le LocalStorage
   */
  private initStorage(): SecureStorage {
    if (window) {
      return new SecureWebStorage(window.localStorage, this.secret);
      // return window.localStorage;
    }
    throw new Error('Local Storage is only available in the Browser');
  }
}
