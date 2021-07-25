import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FaceLandmarksPrediction } from '@tensorflow-models/face-landmarks-detection';
import { forkJoin } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { createStateful, createSubject, emptyObservable } from 'src/app/lib/core/rxjs/helpers';
import { doLog } from '../../../rxjs/operators';
import { OpenCVFaceDetectorService, OpenCvPointsDrawerService } from '../../opencv/ng/opencv.service';
import { FaceMeshDetectorService, FaceMeshPointsDrawerService } from '../../tfjs';
import { isDefined } from '../../types';
import { Video } from '../webcam/helpers';
import { UserCameraService } from '../webcam/user-camera.service';
import { getReadInterval } from './helpers';

declare var cv: any;

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
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
    `
  ]
})
export class FaceDetectionComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() width: number = 320;
  @Input() height: number = 240;
  base64String!: string | undefined;

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('outputImage') outputImage!: ElementRef;
  @ViewChild('sceneImage') sceneImage!: ElementRef;


  private _destroy$ = createSubject();

  @Output() public frontFaceDataURI = new EventEmitter<string>();
  @Output() public profilFaceDataURI = new EventEmitter<string>();

  @Input() frontFaceHaarCascadeURL: string = '/assets/resources/vendor/haarcascade_frontalface_default.xml';
  @Input() profilFaceHaarCascadeURL: string = '/assets/resources/vendor/haarcascade_profileface.xml';
  @Input() eyesClassifierHaarCascadeURL: string = '/assets/resources/vendor/haarcascade_eye.xml';

  private _detectLeftFace$ = createSubject<{ image: HTMLVideoElement | undefined, canvas: HTMLCanvasElement | undefined }>();
  private _detectFrontFace$ = createSubject<{ image: HTMLVideoElement | undefined, canvas: HTMLCanvasElement | undefined }>();

  private videoHTMLElement!: HTMLVideoElement;
  private canvasHTMLElement!: HTMLCanvasElement;

  private _meshPredictions = createStateful<FaceLandmarksPrediction[] | undefined>(undefined);
  showCanvas = false;

  constructor(
    private cameraService: UserCameraService,
    private faceDetector: OpenCVFaceDetectorService,
    private cvDetectedPointsDrawer: OpenCvPointsDrawerService,
    @Inject(DOCUMENT) private document: Document,
    private faceMeshDetector: FaceMeshDetectorService,
    private faceMeshDrawer: FaceMeshPointsDrawerService
  ) {
    const detectLeftProfilFace$ = this._detectLeftFace$
      .pipe(
        startWith({ image: undefined, canvas: undefined }),
        takeUntil(this._destroy$),
        tap(({ image, canvas }) => {
          const interval = getReadInterval();
          if (image && canvas) {
            return this.faceDetector.detectFaceOnVideoStream(
              image,
              interval
            )(
              this.faceDetector.cleanup
            ).pipe(
              tap((state) => {
                Video.writeToCanvas(image as HTMLVideoElement, this.canvasElement.nativeElement as HTMLCanvasElement);
                const context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('2d') || undefined;
                if (state?.points) {
                  // Draw opencv rectangle
                  this.cvDetectedPointsDrawer.drawFacePoints(
                    context
                  )(state?.points || []);
                }
                const predictions = this._meshPredictions.getValue();
                if (predictions) {
                  // Draw mesh
                  this.faceMeshDrawer.drawFacePoints(
                    context
                  )(predictions || []);
                }
                // if (state?.x && state?.y && state?.width && state?.height) {
                //   const result = this.onFacePointDetected(this.videoHTMLElement, state);
                //   // Send Image with rect to facial recognation system for comparison
                //   // this.outputImage.nativeElement.src = result;
                //   this.profilFaceDataURI.emit(result);
                // }
              })
            );
          }
          return emptyObservable();
        })
      );
    const detectFrontFace$ = this._detectFrontFace$
      .pipe(
        startWith({ image: undefined, canvas: undefined }),
        takeUntil(this._destroy$),
        tap(({ image, canvas }) => {
        })
      );
    detectLeftProfilFace$.subscribe();
    detectFrontFace$.subscribe();
  }

  async ngOnInit() {
    // Load the face detector models
    if (!isDefined(this.faceDetector.model) && !isDefined(this.faceMeshDetector.model)) {
      await forkJoin([this.faceDetector
        .loadModel(
          'haarcascade_frontalface_default.xml',
          this.frontFaceHaarCascadeURL
        ), this.faceMeshDetector.loadModel()]).toPromise();
    }
    this.videoHTMLElement = this.videoElement.nativeElement as HTMLVideoElement;
    this.canvasHTMLElement = this.canvasElement.nativeElement as HTMLCanvasElement;

    await this.cameraService.startCamera(
      this.videoHTMLElement,
      'custom',
      (_, dst) => {
        const interval = getReadInterval();
        const image = dst;
        const canvas = this.canvasHTMLElement;
        if (image && canvas) {
          // Run opencv face detector
          this.faceDetector.detectFaceOnVideoStream(
            image,
            interval
          )(this.faceDetector.cleanup)
            .pipe(
              doLog('Detected faces: '),
              takeUntil(this._destroy$),
              tap((state) => {
                Video.writeToCanvas(image as HTMLVideoElement, this.canvasElement.nativeElement as HTMLCanvasElement);
                const context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('2d') || undefined;
                if (state?.points) {
                  // Draw opencv rectangle
                  this.cvDetectedPointsDrawer.drawFacePoints(
                    context
                  )(state?.points || []);
                }
                const predictions = this._meshPredictions.getValue();
                if (predictions) {
                  if (!this.showCanvas) {
                    this.showCanvas = true;
                  }
                  // Draw mesh
                  this.faceMeshDrawer.drawFacePoints(
                    context
                  )(predictions || []);
                }
                // if (state?.x && state?.y && state?.width && state?.height) {
                //   const result = this.onFacePointDetected(this.videoHTMLElement, state);
                //   // Send Image with rect to facial recognation system for comparison
                //   // this.outputImage.nativeElement.src = result;
                //   this.frontFaceDataURI.emit(result);
                // }
              })
            ).subscribe();
          // Run the face mesh detector as well
          this.faceMeshDetector
            .detectFaces(image as HTMLVideoElement, interval)
            .pipe(
              takeUntil(this._destroy$),
              tap(predictions => {
                this._meshPredictions.next(predictions);
              })
            ).subscribe();
        }
      },
      { width: { exact: this.width }, height: { exact: this.height } }
    );
  }

  async ngAfterViewInit() {
  }

  detectProfilFace() {
    this._detectLeftFace$.next({ image: this.videoHTMLElement, canvas: this.canvasHTMLElement });
  }

  onFacePointDetected = (image: HTMLVideoElement, state: any) => (() => {
    const canvas = this.document.createElement("canvas");
    const context = canvas.getContext('2d');
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
  })()

  ngOnDestroy(): void {
    this._destroy$.next();
    this.faceDetector
      .deleteModel()
      .cleanup();
  }

}
