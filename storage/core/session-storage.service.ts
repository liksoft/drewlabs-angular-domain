import { Injectable, Inject } from "@angular/core";
import { IAppStorage } from "../contracts/store-interface";
import { isObject, storageEntry } from "../../utils";
import { SESSION_STORAGE } from "../../utils/ng/common/tokens/storage";
import { SecureWebStorage } from "./storage.secure";

/**
 * @description Browser session storage class for saving data
 */
@Injectable()
export class SessionStorage implements IAppStorage {
  /**
   * @description Browser SessionStorage Object
   * @var {Storage}
   */
  private _store: Storage;

  constructor(
    @Inject("APP_SECRET") private secret: string,
    @Inject(SESSION_STORAGE) storage: Storage
  ) {
    this._store = SessionStorage.initStorage(storage, secret);
  }

  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  get(key: string): any {
    return JSON.parse(
      this._store.getItem(storageEntry(key, this.secret)) as string
    );
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  set(key: string, item: any): void {
    const value = JSON.stringify(isObject(item) ? { ...item } : item);
    this._store.setItem(storageEntry(key, this.secret), value);
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  delete(key: string): void {
    this._store.removeItem(storageEntry(key, this.secret));
  }
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  clear(): void {
    this._store.clear();
  }
  /**
   * @description Initialize le LocalStorage
   */
  static initStorage(storage: Storage, secret: string): Storage {
    if (storage) {
      return new SecureWebStorage(storage, secret);
    }
    throw new Error("Session Storage is only available in the Browser");
  }
}
