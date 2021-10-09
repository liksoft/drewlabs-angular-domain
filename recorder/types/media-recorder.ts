import { Observable } from "rxjs";

/**
 * Type definitions during development
 */
interface MediaRecorderOptions {
  audioBitsPerSecond?: number;
  bitsPerSecond?: number;
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export type MediaRecorderConfig = MediaRecorderOptions;

export interface MediaRecorder {

  // Stream of recorded content
  stream$: Observable<Blob>;

  /**
   * @description Start recording from a given timeslice
   * @param timeslice
   */
  start(timeslice?: number | undefined): void;

  /**
   * @description Stop recording on the media stream
   */
  stop(): void;

  /**
   * @description Get the current recorded track
   */
  toBlob(): BlobPart|Blob;

  /**
   * @description Pauses the recording task
   */
  pause(): void;

  /**
   * @description Resumes the recording task
   */
  resume(): void;

}
