import { JSObject } from "./object";

export type Callable = () => any;
export type Fn = (value?: any) => void;

/**
 * Determines if two objects or two values are equivalent.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `equals`.
 *
 * @param o1 Object or value to compare.
 * @param o2 Object or value to compare.
 * @returns true if arguments are equal.
 */
export function equals(o1: any, o2: any): boolean {
  if (o1 === o2) {
    return true;
  }
  if (o1 === null || o2 === null) {
    return false;
  }
  if (o1 !== o1 && o2 !== o2) {
    return true;
  } // NaN === NaN
  const t1 = typeof o1;
  const t2 = typeof o2;
  let length: number;
  let key: any;
  let keySet: any;
  if (t1 === t2 && t1 === "object") {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) {
        return false;
      }
      length = o1.length;
      if (length === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      keySet = Object.create(null);
      Object.keys(o1).forEach((k) => {
        if (!equals(o1[k], o2[k])) {
          return;
        }
        keySet[k] = true;
      });
      for (key in o2) {
        if (!(key in keySet) && typeof o2[key] !== "undefined") {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

/**
 * Check if the value of the object is not equals to null or undefined
 *
 * @param value
 * @returns
 */
export const isDefined = (value: any) => JSObject.isDefined(value);

/**
 * Check if a given value is a JS object
 * @param item
 * @returns
 */
export const isObject = (item: any) => JSObject.isJsObject(item);

/**
 * @description Checks if a variable is of primitive type aka string|number|boolean
 * @param param [[any]]
 */
export const isPrimitive = (param: any) => {
  switch (typeof param) {
    case "string":
    case "number":
    case "boolean":
      return true;
  }
  return !(
    param instanceof String ||
    param === String ||
    param instanceof Number ||
    param === Number ||
    param instanceof Boolean ||
    param === Boolean
  );
}

/**
 * @description Checks if the provided function parameter is of type number
 */
export const isNumber = (value: any) => {
  value = isNaN(value as any) ? value : +value;
  return (
    typeof value === "number" || value instanceof Number || value === Number
  );
}

export const isNullOrNaN = (value: any) => {
  if (isObject(value) || isArray(value)) {
    return true;
  }
  if (!isDefined(value)) {
    return true;
  }
  return isNaN(value);
};

/**
 * @description Checks if a variable is of Array type
 * @value value [[any]]
 */
export const isArray = (value: any) => Array.isArray(value);

/**
 * @description Get property from a JS obecjt. The function dynamically load property that are inner property
 * of the given object.
 * @param item [[object]]
 * @param field [[string]]
 */
export function getJSObjectPropertyValue(
  item: any,
  key: string,
  deepPropertySeperator: string = "."
) {
  if (!isDefined(key)) {
    return key;
  }
  if (key.indexOf(deepPropertySeperator || ".") !== -1) {
    const innerFields: Array<string> = key.split(deepPropertySeperator || ".");
    let currentObj = item;
    for (const v of innerFields) {
      if (isObject(currentObj) && currentObj[v]) {
        currentObj = currentObj[v];
      } else {
        currentObj = null;
        break;
      }
    }
    return currentObj;
  } else {
    return item[key];
  }
}

/**
 * @description Helper function for flattening an object properties
 * @param ob [[object]]
 */
export function flattenObject(
  ob: { [index: string]: any },
  prefixInnerKeys: boolean = true
) {
  if (isPrimitive(ob)) {
    return ob;
  }
  const returnedObj: { [index: string]: any } = {};
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) {
      continue;
    }
    if (isPrimitive(ob[i]) || isArray(ob[i])) {
      returnedObj[i] = ob[i];
    } else {
      const flatObject = flattenObject(ob[i], prefixInnerKeys);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue;
        }
        const obKey = prefixInnerKeys ? i + "." + x : x;
        returnedObj[obKey] = flatObject[x];
      }
    }
  }
  return returnedObj;
}

/**
 * @description Generate the hascode of a given string
 * @param s [[string]] s as name of the class or object
 */

/**
 * Compute the hash value of a given stringeable has javascript
 * object
 *
 * @param s Value for which the hash value is computed
 * @returns
 */
export function objectHashCode(s: any) {
  const typeofs = typeof s;
  if (typeofs === 'number') {
      return s;
  }
  s = typeofs === 'string' ? s : JSON.stringify(s);
  var hash = 0;
  if (s.length === 0) return hash;
  for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash = hash & hash;
  }
  return hash;
}

export const check =
  (fn: { (arg0: string[]): any; name?: any; required?: any }) =>
  (params: string[] = []) => {
    const { required } = fn;
    const missing = required.filter((param: string) => !(param in params));

    if (missing.length) {
      throw new Error(`${fn.name}() Missing required parameter(s):
    ${missing.join(", ")}`);
    }

    return fn(params);
  };
