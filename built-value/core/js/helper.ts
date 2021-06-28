import * as lodash from 'lodash';
import { isPrimitive, isDefined, isArray } from '../../../utils/types/type-utils';

/**
 * @description Create an instance of a given class from a mappings definition using only the first level definitions of the object
 */

export const deserializeJsObject = <T extends any>(bluePrint: new (...params: any[]) => T, value: any) => {
  if (typeof bluePrint !== 'function') {
    throw new Error('Undefined object type');
  }
  if (!bluePrint.hasOwnProperty('getJsonableProperties')) {
    return null;
  }
  const mappings = (bluePrint as any).getJsonableProperties() || {};
  const obj = new bluePrint() as { [index: string]: any };
  Object.getOwnPropertyNames(value).forEach((prop) => {
    let index = prop;
    let parsedValue = null;
    const innerObj = value[prop];
    const designType = mappings[prop];
    if (
      (designType && typeof designType === 'string' && isPrimitive(innerObj)) ||
      (typeof designType === 'string' && isArray(innerObj))
    ) {
      index = designType;
      parsedValue = innerObj;
    } else if (
      isDefined(designType) &&
      typeof designType === 'object' &&
      isArray(innerObj)
    ) {
      if (!isDefined(designType.type)) {
        index = designType.name || index;
        parsedValue = innerObj;
      } else {
        const values = [];
        index = designType.name || designType;
        for (const item of innerObj) {
          values.push(deserializeJsObject(designType.type, item));
        }
        parsedValue = [...values];
      }
    } else if (isDefined(designType) && typeof designType === 'object' && isDefined(innerObj)) {
      if (!isDefined(designType.type)) {
        index = designType.name || index;
        parsedValue = innerObj;
      } else {
        index = designType.name || designType;
        parsedValue = deserializeJsObject(designType.type, innerObj);
      }
    } else {
      parsedValue = innerObj;
    }
    obj[index] = parsedValue;
  });
  return obj;
};

/**
 * @description Loop through first level properties of the [object]
 * parameter and return there serialized values matching properties
 * of the mappings
 */
export const serializeJsObject = <T extends { [index: string]: any }>(param: T) => {
  const obj = {} as { [index: string]: any };
  if (!isDefined(param)) {
    return null;
  }
  if (!(param as any).constructor.hasOwnProperty('getJsonableProperties')) {
    return null;
  }
  const mappings = (param as any).constructor.getJsonableProperties() || {};
  const objPropertyNames = Object.getOwnPropertyNames(param);
  const parsedProperties: any[] = [];
  Object.keys(mappings).forEach((k) => {
    let value = null;
    let key = null;
    if (typeof mappings[k] === 'string') {
      key = mappings[k] || k;
      value = param[key];
    } else if (typeof mappings[k] === 'object') {
      key = mappings[k].name || mappings[k] || k;
      const currentObject = param[key];
      if (isDefined(currentObject) && isArray(currentObject)) {
        const values = [];
        for (const item of currentObject) {
          values.push(isDefined(item) ? serializeJsObject(item) : item);
        }
        value = [...values];
      } else if (isDefined(currentObject) && !isArray(currentObject)) {
        value = serializeJsObject(currentObject);
      } else {
        value = currentObject;
      }
    } else if (!isDefined(mappings[k])) {
      key = k;
      value = param[k];
    } else {
      throw new Error('Invalid object builder configurations');
    }
    obj[k] = value;
    parsedProperties.push(key);
  });
  const unparsedProperties = lodash.difference(objPropertyNames, parsedProperties);
  unparsedProperties.forEach((k) => {
    obj[k] = param[k];
  });
  return obj;
};
