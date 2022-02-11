import {
  FaceLandmarksDetector,
  FaceLandmarksPrediction,
  SupportedPackages,
} from "@tensorflow-models/face-landmarks-detection";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Observable } from "rxjs";
import { MLModelProvider } from "./model";

export interface FaceLandmarksModelConfig {
  confidence?: number;
  maxFaces?: number;
  scoreThreshold?: number;
  shouldLoadIrisModel: boolean;
}

export type TypeFaceMeshDetector = FaceLandmarksDetector;
export type TypeSupportedPackages = SupportedPackages;
export type TypeFaceMeshPrediction = FaceLandmarksPrediction;

export interface FaceMeshDetector extends MLModelProvider {
  loadModel(
    type?: SupportedPackages,
    config?: FaceLandmarksModelConfig
  ): Observable<FaceLandmarksDetector>;

  deleteModel(): void | Promise<void>;

  detectFaces(
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    _interval: number
  ): Observable<AnnotatedPrediction[] | undefined>;
}
