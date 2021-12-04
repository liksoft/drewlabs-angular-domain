import { isDefined, isPrimitive } from "./type-utils";
import { cloneDeep, isEmpty as lodashIsEmpty } from "lodash";

type GetObjectPropertyFunc = <
  T extends { [index: string]: any },
  R extends any
>(
  source: T,
  key: string,
  seperator?: string
) => R;

/**
 * Global functional interface for getting proprety value of a JS object
 * @param value
 * @param key
 * @returns
 */
export const getObjectProperty = (value: object | any, key: string) =>
  JSObject.getObjectProperty(value, key);

/**
 * Global functional interface for setting proprety value of a JS object
 *
 * @param source
 * @param key
 * @param value
 * @returns
 */
export const setObjectProperty = (
  source: object | any,
  key: string,
  value?: any
) => JSObject.setObjectProperty(source, key, value);

export class JSObject extends Object {
  /**
   * Set property value of a JS Object
   *
   * @param source
   * @param key
   * @param value
   * @returns
   */
  static setObjectProperty = (
    source: object | any,
    key: string,
    value?: any
  ) => {
    if (key === "") {
      return source;
    }
    if (!isDefined(key)) {
      return source;
    }
    if (!isDefined(source)) {
      return source;
    }
    return (value[key] = value || undefined);
  };

  /**
   * Returns true if the object is empty
   *
   * @param value
   * @returns
   */
  static isEmpty = <T extends any>(value: T) => lodashIsEmpty(value);

  /**
   * Returns the default value passed by used if the value of the object is empty
   *
   * @param value
   * @param default_
   * @returns
   */
  static defaultIfEmpty = <T extends any>(value: T, default_: any = {}) =>
    JSObject.isEmpty(value) ? value : (default_ as T);

  /**
   * Check if the value of the object is not equals to null or undefined
   * @param value
   * @returns
   */
  static isDefined = (value: any) =>
    typeof value !== "undefined" && value !== null && value !== undefined;

  static isJsObject(item: any): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  /**
   * @description Get property from a JS obecjt. The function dynamically load property that are inner property
   * of the given object.
   * @param source [[object]]
   * @param field [[string]]
   */
  static getObjectProperty = <T extends { [index: string]: any } | undefined>(
    source: T,
    key: string,
    seperator: string = "."
  ) => {
    if (key === "" || !JSObject.isDefined(key) || !JSObject.isDefined(source)) {
      return source ?? undefined;
    }
    if (key.includes(seperator ?? ".")) {
      // Creates an array of inner properties
      const properties = key.split(seperator ?? ".");
      let current = source;
      // Reduce the source object to a single value
      return properties.reduce((carry, prop) => {
        if (carry) {
          carry =
            JSObject.isJsObject(current) && carry[prop]
              ? carry[prop] ?? undefined
              : undefined;
        }
        return carry;
      }, source);
    } else {
      return source ? source[key] : undefined;
    }
  };

  /**
   * @description Helper function for flattening an object properties
   * @param source [[object]]
   */
  static flatten = (
    source: { [index: string]: any },
    prefix: boolean = true
  ) => {
    if (isPrimitive(source)) {
      return source;
    }
    const dst: { [index: string]: any } = {};
    for (const prop in source) {
      if (!source.hasOwnProperty(prop)) {
        continue;
      }
      if (isPrimitive(source[prop]) || Array.isArray(source[prop])) {
        dst[prop] = source[prop];
      } else {
        const flatten = JSObject.flatten(source[prop], prefix);
        for (const propx in flatten) {
          if (!flatten.hasOwnProperty(propx)) {
            continue;
          }
          const key = prefix ? prop + "." + propx : propx;
          dst[key] = flatten[propx];
        }
      }
    }
    return dst;
  };

  /**
   * Creates a deep copy of the given object
   *
   * @param value
   * @returns
   */
  static cloneDeep = <T extends {[index: string]: any}>(value: T) => cloneDeep(value);
}
