import * as Dropzone from "dropzone";
import { DropzoneConfig } from "../types";

/**
 * @description Dropzone creator function
 * @param container
 * @param options
 */
export const createDropzone = (
  container: string | HTMLElement,
  options: DropzoneConfig
) => new Dropzone(container, options);
