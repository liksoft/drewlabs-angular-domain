import { Injectable } from '@angular/core';
import { IAppStorage, SecureWebStorage, SecureStorage } from '../contracts/store-interface';
import { storageEntry } from '../../utils/app-helpers';
// declare const sessionStorage: Storage;

/**
 * @description Browser session storage class for saving data
 */
@Injectable()
export class SessionStorage implements IAppStorage {
  /**
   * @description Browser SessionStorage Object
   * @var {Storage}
   */
  store: SecureStorage;

  constructor() {
    this.store = this.initStorage();
  }

  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  get(key: string): any {
    return JSON.parse(this.store.getItem(storageEntry(key)));
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  set(key: string, item: any): void {
    this.store.setItem(storageEntry(key), JSON.stringify(item));
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  delete(key: string): void {
    this.store.removeItem(storageEntry(key));
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
      return new SecureWebStorage(window.sessionStorage);
      // return window.sessionStorage;
    }
    throw new Error('Session Storage is only available in the Browser');
  }
}
