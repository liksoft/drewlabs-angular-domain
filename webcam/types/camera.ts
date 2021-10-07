import { Observable } from "rxjs";
import { VideoConstraints } from "./constraints";

export type OnVideoStreamHandlerFn = (
  source: MediaStream | any,
  dest: any
) => void;

/**
 * @description Type definition of a web camservice
 */
export interface Webcam {
  startCamera(
    video: any,
    resolution: string,
    callback: OnVideoStreamHandlerFn,
    fallbackResolution?: VideoConstraints
  ): Promise<any> | Observable<any>;

  stopCamera(onComplete?: () => void): Promise<void> | void;
}
