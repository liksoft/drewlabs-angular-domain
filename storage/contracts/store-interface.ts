import CryptoES from 'crypto-es';

type HashFn = (key: string) => string | CryptoES.lib.WordArray;
type DecrypterFn = (data: string | CryptoES.lib.CipherParams) => any;
type EncrypterFn = (data: any) => string | CryptoES.lib.WordArray;

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
export interface ISecureStorageOption {
  hash: HashFn;
  encrypt: EncrypterFn;
  decrypt: DecrypterFn;
}
