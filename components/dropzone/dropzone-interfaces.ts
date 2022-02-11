import { InjectionToken } from "@angular/core";
import { DropzoneEvent as BaseDropzoneEvent } from "./types";

export const DROPZONE_CONFIG = new InjectionToken("DROPZONE_CONFIG");

export type DropzoneEvent = BaseDropzoneEvent;

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
