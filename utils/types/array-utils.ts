import { Filtrable } from "./contracts/filtrable";
import {
  chain,
  difference,
  flatten,
  intersection,
  last,
  remove,
  slice,
  sortBy,
  take,
  uniqBy,
} from "lodash";

/**
 * Class de manipulation des Objet de type tableau
 */
export class ArrayUtils {
  /**
   * @description Filter a list of [[Filtrable]] item based on a specific condition
   * @param list list of [[Filtrable]]
   * @param key Matching key
   * @param needle value to match
   */
  public static filter(
    list: Array<Filtrable>,
    key: string,
    needle: any
  ): Filtrable[] {
    const matches = list.filter((v: Filtrable) => {
      return v.has(key, needle);
    });
    return matches;
  }

  /**
   * @description Filter a list of [[Filtrable]] based on their provided keys
   * @param list list of [[Filtrable]]
   * @param matcher Matching object
   */
  public static filterAll(
    list: Array<Filtrable>,
    matcher: { [index: string]: any }
  ): any[] {
    return list.filter((v: Filtrable) => {
      let found = false;
      for (const i in matcher) {
        if (v.has(i, matcher[i])) {
          found = true;
          break;
        }
      }
      return found;
    });
  }

  /**
   * @description Zip a list of item into an Array List
   * @param list List of items
   * @param chunkSize Size of each chunk
   */
  public static chunk(list: Array<any>, chunkSize: number): Array<any> {
    const tempArray: Array<any> = [];
    for (let index = 0; index < list.length; index += chunkSize) {
      const listChunk: Array<any> = list.slice(index, index + chunkSize);
      tempArray.push(listChunk);
    }
    return tempArray;
  }

  /**
   * @description Sort an array of items based on a specific condition
   * @param items List of items
   * @param path List of properties to compare
   * @param order Sorting order of the output list
   */
  public static sort(
    items: Array<any>,
    path: string[] | string,
    order: number
  ): Array<any> {
    // Check if is not null
    if (!items || !path || !order) {
      return items;
    }
    return items.sort((a: any, b: any) => {
      // We go for each property followed by path
      if (path instanceof Array) {
        path.forEach((property) => {
          a = a[property];
          b = b[property];
        });
      } else {
        a = a[path];
        b = b[path];
      }
      // Order * (-1): We change our order
      // Compare dates
      if (Date.parse(a as string) && Date.parse(b as string)) {
        a = new Date(a as string);
        b = new Date(b as string);
      }
      return a > b ? order : order * -1;
    });
  }

  /**
   * @description Convert a multi-dimensional array into a single dimensional array
   * @param list A two dimensionnal array of objects
   */
  public static flatten(list: any[][]) {
    return flatten(list);
  }

  /**
   * @description Returns a sublist of the specified n length
   * @param list List of objects to collect items from
   * @param n Number of objects to collect
   */
  public static take(list: any[], n: number) {
    return take(list, n);
  }

  /**
   * @description Returns a sublist skipping a given number of items
   * @param list List of objects
   * @param index Starting index
   */
  public static skip(list: any[], index: number) {
    return slice(list, index);
  }

  /**
   * @description Sort a list of object by a property key
   * @param list List of objects
   * @param key Comparison key
   * @param order [[number]]
   */
  public static sortBy(list: any[], key: string, order = 1) {
    if (order === -1) {
      return chain(sortBy(list, key)).reverse().value();
    }
    return sortBy(list, key);
  }

  /**
   * @description Checks if an item is an Array or not
   * @param value [[any]]
   */
  public static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public static equals(lhs: any[], rhs: any[]) {
    let equals = true;
    if (lhs.length !== rhs.length) {
      equals = false;
    } else {
      // comapring each element of array
      for (const i of lhs) {
        if (!rhs.includes(i)) {
          equals = false;
          break;
        }
      }
    }
    return equals;
  }

  /**
   * @description Returns boolean result depending on wheter all values of the second array are in the first array
   * @param lhs [[any[]]]
   * @param rhs [[any[]]]
   */
  public static containsAll(lhs: any[], rhs: any[]) {
    return ArrayUtils.equals(ArrayUtils.intersect(lhs, rhs), rhs);
  }

  /**
   * Returns values in both src and dst list
   * @param first
   * @param other
   * @returns
   */
  public static intersect = <T extends any>(first: T[], other: T[]) =>
    intersection(first, other);

  /**
   * Returns a copy of {values} rejecting items matching the predicate
   *
   * @param values
   * @param fn
   * @returns
   */
  public static reject = <T>(values: T[], fn: (value: T) => boolean) => {
    const values_ = [...values];
    remove(values_, fn);
    return values_;
  };

  /**
   * Compute the diff of two set of values
   *
   * @param first
   * @param other
   * @returns
   */
  public static diff = <T extends any>(first: T[], other: T[]) =>
    difference(first, other);

  /**
   * Compute a set/list of unique values using the user given key
   *
   * @param values
   * @param key
   * @returns
   */
  public static uniqBy = <T>(values: T[], key: string) => uniqBy(values, key);

  /**
   * Returns the last element of the list
   *
   * @param values
   * @returns
   */
  static last = <T>(values: T[]) => last(values);
}

export { ArrayUtils as JSArray };
