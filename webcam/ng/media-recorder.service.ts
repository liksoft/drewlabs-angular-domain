import { Injectable, OnDestroy } from "@angular/core";
import { createSubject } from "../../rxjs/helpers";
import {
  MediaRecorder as MediaRecorderInterface,
  MediaRecorderConfig,
} from "../types";

@Injectable()
export class MediaRecorderService implements MediaRecorderInterface, OnDestroy {
  // Recorded content stream
  private readonly _stream$ = createSubject<Blob>();
  public stream$ = this._stream$.asObservable();
  // Instance initializer
  private constructor(
    private recorder?: MediaRecorder,
    private buffer: BlobPart[] | undefined = []
  ) {
    this.recorder?.addEventListener("dataavailable", (ev: BlobEvent) => {
      this.buffer = [...(this.buffer || []), ev.data];
    });

    this.recorder?.addEventListener("stop", (e: Event) => {
      this._stream$.next(this.currentTrack());
      this.buffer = [];
    });
  }

  static createFromStream(
    stream: MediaStream,
    options: MediaRecorderConfig = { mimeType: "video/mp4" }
  ) {
    const recorder = new MediaRecorder(stream, options || {});
    return new MediaRecorderService(recorder);
  }

  static createFromTracks(tracks: MediaStreamTrack[]) {
    return MediaRecorderService.createFromStream(new MediaStream(tracks));
  }

  public start(timeslice?: number | undefined) {
    this.recorder?.start(timeslice);
  }

  public stop() {
    this.recorder?.stop();
  }

  public currentTrack() {
    return new Blob([...(this.buffer || [])], { type: "video/mp4" });
  }

  dispose() {
    this.recorder?.removeEventListener("dataavailable", () => {});
    this.recorder = undefined;
    this.buffer = undefined;
  }

  ngOnDestroy() {
    if (this.recorder) {
      this.dispose();
    }
  }
}
