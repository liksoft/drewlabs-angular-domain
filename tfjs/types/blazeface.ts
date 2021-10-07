import { BlazeFaceModel, NormalizedFace } from "@tensorflow-models/blazeface";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Observable } from "rxjs";
import { MLModelProvider } from "./model";

export interface BlazeModelConfig {
  maxFaces?: number;
  inputWidth?: number;
  inputHeight?: number;
  iouThreshold?: number;
  scoreThreshold?: number;
  modeUrl?: any;
}

export type TypeBlazeDetector = BlazeFaceModel;
export type TypeBlazePrediction = NormalizedFace;

export interface BlazeFaceDetector extends MLModelProvider {
  loadModel(type?: BlazeModelConfig): Observable<BlazeFaceModel>;

  deleteModel(): void | Promise<void>;

  detectFaces(
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    _interval: number
  ): Observable<AnnotatedPrediction[] | undefined>;
}
