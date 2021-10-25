import * as _ from "lodash";

/**
 * Returns the substring after the last occurrence of the specified character
 * @param char [[string]]
 * @param haystack [[string]]
 */
export const afterLast = (char: string, haystack: string) =>
  _.last(haystack.split(char));

/**
 * Returns the strings after the first occurence the specified character
 * @param char [[string]]
 * @param haystack [[string]]
 */
export const after = (char: string, haystack: string) =>
  haystack.split(char)[1] || "";

/**
 * Returns the strings before the first occurence the specified character
 * @param char [[string]]
 * @param haystack [[string]]
 */
export const before = (char: string, haystack: string) =>
  haystack.split(char)[0] || "";

/**
 * Returns the strings before the last occurence the specified character
 * @param char [[string]]
 * @param haystack [[string]]
 */
export const beforeLast = (char: string, haystack: string) => {
  const chars = haystack.split(char);
  return chars[chars.length - 2];
};

export const toBinary = (value: string) => {
  const codeUnits = new Uint16Array(value.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = value.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
};
