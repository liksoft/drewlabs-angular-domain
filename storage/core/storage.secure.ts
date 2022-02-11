import CryptoES from "crypto-es";
import { ISecureStorageOption } from "../contracts/store-interface";

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
        if (typeof value !== "string") {
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
        return this._storage.key(id) as string;
    }

    /**
     * @description Getter for the length of items in the store
     */
    get length(): number {
        return this._storage.length;
    }
}

export class SecureWebStorage extends SecureStorage {
    constructor(storage: Storage, secret: string) {
        super(storage, {
            hash: function hash(key: string): string | CryptoES.lib.WordArray {
                const $hash = CryptoES.MD5(key);
                return $hash.toString();
            },
            encrypt: function encrypt(data: any): string | CryptoES.lib.WordArray {
                data = CryptoES.AES.encrypt(data, secret);
                return data.toString();
            },
            decrypt: function (data: string | CryptoES.lib.CipherParams): any {
                const plain = CryptoES.AES.decrypt(data, secret);
                return plain.toString(CryptoES.enc.Utf8);
            },
        });
        this._secret = secret;
    }

    private _secret: string;

    get secret() {
        return this._secret;
    }
}
