import { DropzoneConfig } from "../types";

const isDeepObject = (value: any) =>
  typeof value !== "undefined" &&
  value !== null &&
  !Array.isArray(value) &&
  typeof value === "object" &&
  !(value instanceof HTMLElement);

/**
 * @description Creates an instance of Dropzone configuration
 *
 * @param config
 * @param target
 */
export const createDzConfig = (
  config: DropzoneConfig | any = {},
  target?: any
) => {
  target = target || ({} as DropzoneConfig);
  for (const key in config) {
    if (
      typeof config !== "undefined" &&
      config !== null &&
      isDeepObject(config[key])
    ) {
      target[key] = createDzConfig(config[key], {});
    } else {
      target[key] = config[key];
    }
  }
  return target as DropzoneConfig;
};
