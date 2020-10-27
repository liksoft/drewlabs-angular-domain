import * as  CryptoJS from 'crypto-js';

type HashFn = (key: string) => string | CryptoJS.WordArray;
type DecrypterFn = (data: string | CryptoJS.WordArray) => any;
type EncrypterFn = (data: any) => string | CryptoJS.WordArray;

export interface IAppStorage {
  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  get(key: string): any;
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  set(key: string, value: any): void;
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  delete(key: string): void;
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  clear(): void;
}
interface ISecureStorageOption {
  hash: HashFn;
  encrypt: EncrypterFn;
  decrypt: DecrypterFn;
}

export abstract class SecureStorage implements Storage {

  // tslint:disable-next-line: variable-name
  private _storage: Storage;
  // tslint:disable-next-line: variable-name
  private _options: ISecureStorageOption;

  constructor(storage: Storage, options: ISecureStorageOption) {
    this._storage = storage;
    this._options = options;
  }
  /**
   * @description Get a value from the key -> value store
   * @return [[any]]
   */
  getItem(key: string): any {
    key = this._options.hash(key) as string;
    const value = this._storage.getItem(key);
    if (typeof value !== 'string') {
      return value;
    }
    return JSON.parse(this._options.decrypt(value));
  }
  /**
   * @description Set a value in the key -> value store
   * @return [[void]]
   */
  setItem(key: string, value: any): any {
    key = this._options.hash(key) as string;
    value = JSON.stringify(value);
    return this._storage.setItem(key, this._options.encrypt(value) as string);
  }
  /**
   * @description Delete item from the key -> value store with a provided key
   * @return [[void]]
   */
  removeItem(key: string): any {
    key = this._options.hash(key) as string;
    return this._storage.removeItem(key);
  }
  /**
   * @description Clear or reinitialize the key -> value store
   * @return [[void]]
   */
  clear(): void {
    return this._storage.clear();
  }

  key(id: number): string {
    return this._storage.key(id);
  }

  /**
   * @description Getter for the length of items in the store
   */
  get length(): number { return this._storage.length; }

}

export class SecureWebStorage extends SecureStorage {

  constructor(storage: Storage, secret: string) {
    super(storage, {
      hash: function hash(key: string): string | CryptoJS.WordArray {
        const $hash = CryptoJS.MD5(key, secret);
        return $hash.toString();
      },
      encrypt: function encrypt(data: any): string | CryptoJS.WordArray {
        data = CryptoJS.AES.encrypt(data, secret);
        return data.toString();
      },
      decrypt: function decrypt(data: string | CryptoJS.WordArray): any {
        const plain = CryptoJS.AES.decrypt(data, secret);
        return plain.toString(CryptoJS.enc.Utf8);
      }
    });

  }
}
