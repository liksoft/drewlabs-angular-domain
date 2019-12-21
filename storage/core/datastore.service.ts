import { Injectable } from '@angular/core';
import { IAppStorage } from '../contracts/store-interface';
import { environment } from 'src/environments/environment';
import { storageEntry } from '../../utils/app-helpers';

/**
 * @description InMemory data storage class for saving temporary data
 */
@Injectable()
export class DataStoreService implements IAppStorage {
  private appStore: object;
  private appStorageKeyPrefix = environment.applicationUniqueID ? environment.applicationUniqueID : 'App_By_Sedana&_Drew';


  constructor() {
    this.appStore = new Object();
  }

  /**
   * @description Getter du in memory store
   * @return Return store container [[object]]
   */
  get store(): object {
    return this.appStore;
  }

  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  public get(key: string): any {
    return this.appStore[storageEntry(key)];
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  public set(key: string, value: any): void {
    this.appStore[storageEntry(key)] = value;
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  public delete(key: string): void {
    this.appStore[storageEntry(key)] = null;
  }
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  public clear(): void {
    this.appStore = new Object();
  }
}
