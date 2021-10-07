import { Observable } from "rxjs";

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
  currentTrack(): void;
}
