
export interface ICollection<T> {
  /**
   * @description Add a new item to the collection
   * @param key [[string]] index key of the item
   * @param value the actual item inserted
   */
  add(key: string, value: T): void;
  /**
   * @description Checks if a key exists in the collection
   * @param key [[string]] index key of the needle
   */
  contains(key: string): boolean;
  /**
   * @description Return the number of items in the collection
   */
  count(): number;
  /**
   * @description Get an item based on it key
   * @param key [[string]] index key of the item
   */
  get(key: string): T;
  /**
   * @description Returns the list of keys contains in the collection
   */
  keys(): string[];
  /**
   * @description Removes an item from the  collection based on it index key
   * @param key index key of the item
   */
  remove(key: string|string[]): ICollection<T>;

  /**
   * @description Returns the list of items contains in the collection
   */
  values(): T[];
}
