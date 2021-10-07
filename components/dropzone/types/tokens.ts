import { InjectionToken } from "@angular/core";
import { DropzoneConfig } from "./dz-config";
import { DropzoneDict } from "./dz-core";
import { DropzoneEvent } from "./dz-event";

export const DROPZONE_CONFIG = new InjectionToken<DropzoneConfig>( //
  "Dropzone configuration provider"
);

export const DROPZONE_DICT = new InjectionToken<DropzoneDict>(
  "Provider for dictionary values"
);

export const DropzoneEvents: DropzoneEvent[] = [
  "error",
  "success",
  "sending",
  "canceled",
  "complete",
  "processing",

  "drop",
  "dragStart",
  "dragEnd",
  "dragEnter",
  "dragOver",
  "dragLeave",

  "thumbnail",
  "addedFile",
  "addedFiles",
  "removedFile",
  "uploadProgress",
  "maxFilesReached",
  "maxFilesExceeded",

  "errorMultiple",
  "successMultiple",
  "sendingMultiple",
  "canceledMultiple",
  "completeMultiple",
  "processingMultiple",

  "reset",
  "queueComplete",
  "totalUploadProgress",
];
