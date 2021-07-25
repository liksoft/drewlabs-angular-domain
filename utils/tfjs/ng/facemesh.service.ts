import { Injectable } from "@angular/core";
import { FaceLandmarksDetector, FaceLandmarksPrediction, SupportedPackages } from "@tensorflow-models/face-landmarks-detection";
import { interval } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { observableFrom } from "../../../rxjs/helpers";
import { Video } from "../../ng/webcam/helpers";
import { isDefined } from "../../types";
import { drawMesh } from "../helpers";
import { loadModel, predict } from "../helpers/facemesh";

@Injectable({
  providedIn: 'root'
})
export class FaceMeshDetectorService {

  get model() {
    return this._model;
  }

  _model!: FaceLandmarksDetector;

  public loadModel = (type?: SupportedPackages) => {
    const result$ = observableFrom(loadModel(type))
      .pipe(
        tap(model => this._model = model)
      );
    return result$;
  }

  public detectFaces = (
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    _interval: number
  ) => {
    if (!isDefined(this.model)) {
      throw new Error('Model must be loaded before calling the detector function... Call loadModel() before calling this detectFaces()');
    }
    return interval(_interval)
      .pipe(
        mergeMap(_ => observableFrom(predict(this._model, input instanceof HTMLVideoElement ? Video.read(input) : input)))
      );
  }

}

@Injectable({
  providedIn: 'root'
})
export class FaceMeshPointsDrawerService {

  public drawFacePoints = (context?: CanvasRenderingContext2D) => (facePoints?: FaceLandmarksPrediction[]) => {
    if (facePoints && context) {
      requestAnimationFrame(
        () => {
          drawMesh(facePoints, context || undefined)
        }
      );
    }
  }
}
