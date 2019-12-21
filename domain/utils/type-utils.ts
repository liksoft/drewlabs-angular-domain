export type ICallable = () => any;

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
  if (t1 === t2 && t1 === 'object') {
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
      Object.keys(o1).forEach(k => {
        if (!equals(o1[k], o2[k])) {
          return false;
        }
        keySet[k] = true;
      });
      for (key in o2) {
        if (!(key in keySet) && typeof o2[key] !== 'undefined') {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

export function isDefined(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * @description Checks if a variable is of primitive type aka string|number|boolean
 * @param param [[any]]
 */
export function isPrimitive(param: any): boolean {
  switch (typeof param) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
  }
  return !!(param instanceof String || param === String ||
    param instanceof Number || param === Number ||
    param instanceof Boolean || param === Boolean);
}

/**
 * @description Checks if a variable is of Array type
 * @param param [[any]]
 */
export function isArray(param: any): boolean {
  if (param === Array) {
    return true;
  } else if (typeof Array.isArray === 'function') {
    return Array.isArray(param);
  } else {
    return !!(param instanceof Array);
  }
}
