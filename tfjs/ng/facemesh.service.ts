import { Injectable, OnDestroy } from "@angular/core";
import { interval } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { emptyObservable, observableFrom } from "../../rxjs/helpers";
import { Video } from "../../webcam/helpers";
import { drawMesh } from "../helpers";
import { loadModel, predict } from "../helpers/facemesh";
import {
  FaceLandmarksModelConfig,
  FaceMeshDetector,
  TypeFaceMeshDetector,
  TypeFaceMeshPrediction,
  TypeSupportedPackages,
} from "../types";

@Injectable()
export class FaceMeshDetectorService implements FaceMeshDetector, OnDestroy {
  _model!: TypeFaceMeshDetector | undefined;

  getModel() {
    return this._model;
  }

  public loadModel = (
    type?: TypeSupportedPackages,
    config: FaceLandmarksModelConfig = { shouldLoadIrisModel: true }
  ) => {
    const result$ = observableFrom(loadModel(type, config)).pipe(
      tap((model) => (this._model = model))
    );
    return result$;
  };
  public deleteModel = () => (this._model = undefined);

  public detectFaces = (
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
    _interval: number
  ) => {
    if (this._model) {
      return interval(_interval).pipe(
        mergeMap((_) => {
          if (this._model && input) {
            return observableFrom(
              predict(
                this._model,
                input instanceof HTMLVideoElement ? Video.read(input) : input
              )
            );
          }
          return emptyObservable();
        })
      );
    }
    throw new Error(
      "Model must be loaded before calling the detector function... Call loadModel() before calling this detectFaces()"
    );
  };

  ngOnDestroy(): void {
      this.deleteModel();
  }

}

@Injectable({
  providedIn: "root",
})
export class FaceMeshPointsDrawerService {
  public drawFacePoints =
    (context?: CanvasRenderingContext2D) =>
    (facePoints?: TypeFaceMeshPrediction[]) => {
      if (facePoints && context) {
        drawMesh(facePoints, context || undefined);
      }
    };
}
