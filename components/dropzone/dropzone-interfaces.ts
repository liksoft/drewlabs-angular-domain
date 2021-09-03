import { InjectionToken } from '@angular/core';

export const DROPZONE_CONFIG = new InjectionToken('DROPZONE_CONFIG');

export type DropzoneEvent = 'error' | 'success' | 'sending' | 'canceled' | 'complete' |
  'processing' | 'drop' | 'dragStart' | 'dragEnd' | 'dragEnter' | 'dragOver' | 'dragLeave' |
  'thumbnail' | 'addedFile' | 'addedFiles' | 'removedFile' | 'uploadProgress' | 'maxFilesReached' |
  'maxFilesExceeded' | 'errorMultiple' | 'successMultiple' | 'sendingMultiple' | 'canceledMultiple' |
  'completeMultiple' | 'processingMultiple' | 'reset' | 'queueComplete' | 'totalUploadProgress';

export const DropzoneEvents: DropzoneEvent[] = [
  'error',
  'success',
  'sending',
  'canceled',
  'complete',
  'processing',

  'drop',
  'dragStart',
  'dragEnd',
  'dragEnter',
  'dragOver',
  'dragLeave',

  'thumbnail',
  'addedFile',
  'addedFiles',
  'removedFile',
  'uploadProgress',
  'maxFilesReached',
  'maxFilesExceeded',

  'errorMultiple',
  'successMultiple',
  'sendingMultiple',
  'canceledMultiple',
  'completeMultiple',
  'processingMultiple',

  'reset',
  'queueComplete',
  'totalUploadProgress'
];
