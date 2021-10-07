import { InjectionToken } from "@angular/core";
import { MediaRecorder } from "./media-recorder";
import { Webcam } from "./camera";

export const WEBCAM = new InjectionToken<Webcam>("WEB AGENT Camera Service");

export const MEDIA_RECORDER = new InjectionToken<MediaRecorder>(
  'Media Recorder Provider'
);
