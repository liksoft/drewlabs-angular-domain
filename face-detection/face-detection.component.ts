import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { forkJoin } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import {
  createSubject,
  timeout as setTimeoutFn,
} from "src/app/lib/core/rxjs/helpers";
import {
  BlazeFaceDetector,
  BLAZE_FACE,
  FaceMeshDetector,
  FACE_MESH,
} from "../tfjs";
import { FaceMeshPointsDrawerService } from "../tfjs/ng";
import { Canvas } from "../utils/browser";
import { WEBCAM, Webcam } from "../webcam";
import { Video } from "../webcam/helpers";
import { getReadInterval } from "./helpers";

declare var cv: any;

@Component({
  selector: "app-face-detection",
  templateUrl: "./face-detection.component.html",
  styles: [
    `
      .hidden-video {
        display: none;
      }
      .not-hidden-canvas {
        display: block;
      }
      .hidden-canvas {
        display: none;
      }
    `,
  ],
})
export class FaceDetectionComponent implements OnInit, OnDestroy {
  @Input() width: number = 320;
  @Input() height: number = 240;
  public showCanvas = false;

  @ViewChild("videoElement") videoElement!: ElementRef;
  @ViewChild("canvasElement") canvasElement!: ElementRef;
  @ViewChild("outputImage") outputImage!: ElementRef;
  @ViewChild("sceneImage") sceneImage!: ElementRef;

  private _destroy$ = createSubject();
  @Output() public frontFaceDataURI = new EventEmitter<string>();
  @Output() public profilFaceDataURI = new EventEmitter<string>();

  @Input() profilFaceHaarCascadeURL: string =
    "/assets/resources/vendor/haarcascade_profileface.xml";

  private videoHTMLElement!: HTMLVideoElement;
  private canvasHTMLElement!: HTMLCanvasElement;

  @Input() totalFaces: number = 1;
  @Input() confidenceScore: number = 0.9;
  @Input() detectorTimeOut: number = 7000;
  @Input() noFacesDetectedTimeOut = 14000;

  private _detectFacesResult!: { size?: number; encodedURI?: string };
  @Output() detectFacesResultEvent = new EventEmitter<{
    size?: number;
    encodedURI?: string;
  }>();
  @Output() noFaceDetectedEvent = new EventEmitter<boolean>();
  @Output() videoStreamEvent = new EventEmitter<MediaStream>();

  showCameraError: boolean = false;

  constructor(
    @Inject(WEBCAM) private camera: Webcam,
    @Inject(BLAZE_FACE) private faceDetector: BlazeFaceDetector,
    @Inject(DOCUMENT) private document: Document,
    @Inject(FACE_MESH) private faceMeshDetector: FaceMeshDetector,
    private drawer: FaceMeshPointsDrawerService
  ) {}

  async ngOnInit() {
    await this.initializeComponent();
  }

  initializeComponent = () =>
    (async () => {
      this.showCameraError = false;
      this.showCanvas = false;
      if (this.detectorTimeOut > this.noFacesDetectedTimeOut) {
        throw new Error(
          "Detector wait time out must be less than the noFacesDetectedTimeOut input value"
        );
      }
      // Load the face detector models
      if (
        typeof this.faceMeshDetector.getModel() === "undefined" ||
        this.faceMeshDetector.getModel() === null
      ) {
        await forkJoin([
          this.faceMeshDetector.loadModel(undefined, {
            shouldLoadIrisModel: true,
            scoreThreshold: this.confidenceScore || 0.9,
            maxFaces: this.totalFaces || 3,
          }),
        ]).toPromise();
      }
      this.videoHTMLElement = this.videoElement
        .nativeElement as HTMLVideoElement;
      this.canvasHTMLElement = this.canvasElement
        .nativeElement as HTMLCanvasElement;

      try {
        await this.camera.startCamera(
          this.videoHTMLElement,
          "custom",
          (_, dst) => {
            this.videoStreamEvent.next(_);
            console.log('Content: ', dst);
            console.log('Unknown: ', _);
            const image = dst;
            const canvas = this.canvasHTMLElement;
            if (image && canvas) {
              // Set a timeout to wait for before checking the detected faces
              // Notify the container component of no face detected event
              setTimeoutFn(() => {
                if (
                  typeof this._detectFacesResult === "undefined" ||
                  this._detectFacesResult === null
                ) {
                  this.noFaceDetectedEvent.emit(true);
                }
              }, this.noFacesDetectedTimeOut);

              // Wait for certain time before detecting client faces
              setTimeoutFn(() => {
                if (this._detectFacesResult) {
                  this.detectFacesResultEvent.emit(this._detectFacesResult);
                }
              }, this.detectorTimeOut);

              const interval_ = getReadInterval();
              // Run opencv face detector
              // Run the face mesh detector as well
              this.faceMeshDetector
                .detectFaces(image as HTMLVideoElement, interval_)
                .pipe(
                  takeUntil(this._destroy$),
                  tap((predictions) => {
                    requestAnimationFrame(() => {
                      const canvas = Video.writeToCanvas(
                        image as HTMLVideoElement,
                        this.canvasElement.nativeElement as HTMLCanvasElement
                      );
                      if (
                        predictions?.length === this.totalFaces &&
                        predictions[0].faceInViewConfidence >=
                          this.confidenceScore
                      ) {
                        this._detectFacesResult = {
                          size: predictions?.length,
                          encodedURI: Canvas.readAsDataURL(canvas),
                        };
                      }
                      const context =
                        (
                          this.canvasElement.nativeElement as HTMLCanvasElement
                        ).getContext("2d") || undefined;
                      if (!this.showCanvas) {
                        this.showCanvas = true;
                      }
                      // Draw mesh
                      this.drawer.drawFacePoints(context)(predictions || []);
                    });
                  })
                )
                .subscribe();
            }
          },
          {
            width: { exact: this.width },
            height: { exact: this.height },
          }
        );
      } catch (error) {
        this.showCameraError = true;
      }
    })();

  detectProfilFace() {}

  onFacePointDetected = (image: HTMLVideoElement, state: any) =>
    (() => {
      const canvas = this.document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        const { videoWidth, videoHeight } = image;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const x = state?.x;
        const y = state?.y;
        const stateWith = state?.width;
        const stateHeight = state?.height + 12;
        context?.drawImage(image, 0, 0);
        context.lineWidth = 1;
        context.strokeStyle = "green";
        context.strokeRect(x, y, stateWith, stateHeight);
        const frontalFaceLandMarks = canvas.toDataURL();
        return frontalFaceLandMarks;
      }
      return undefined;
    })();

  ngOnDestroy(): void {
    this._destroy$.next();
    this.faceDetector.deleteModel();
    this.faceMeshDetector.deleteModel();
    this.camera.stopCamera();
  }
}