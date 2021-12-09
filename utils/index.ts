/**
 * @description Generate a storage key by prefixing the provided key with the application unique key
 * @param value [[string]]
 */
export const storageEntry = (value: string, secret?: string): string => {
  return `${secret ? secret : "APP_SECRET_BY_DREWLABS"}_${value}`;
};

/**
 * @description Generate a unique big integer as filename
 */
export const randomfilename = () =>
  `${Math.random().toString(36).substring(2, 15)}${Math.random()
    .toString(36)
    .substring(2, 15)}`;

export {
  Dialog,
  WindowRef,
  readFileAsDataURI,
  b64toBlob,
  Browser,
  DOM,
  LoadLibraryOptions,
} from "./browser";
export { MomentUtils } from "./datetime";
export { ExcelUtils } from "./doc-utils";

// JS Types helper functions
export {
  equals,
  isDefined,
  isNumber,
  isObject,
  isArray,
  isPrimitive,
  getJSObjectPropertyValue,
  check,
  ArrayUtils,
  Filtrable,
  getObjectProperty,
  maxNumberSize,
  setObjectProperty,
  Order,
  toBinary,
  JSObject,
  JSArray,
} from "./types";

// URL Utilities functions
export { URLUtils } from "./url/url";

// Numbers formatters implementations
export { numberToAmountFormat } from "./format/number";

// Loggers provider
export { Err, Log } from "./logger";

export {
  JSDate,
  JsDateParamType,
  Month,
  MonthProvider,
  MONTHS,
} from "./datetime";
