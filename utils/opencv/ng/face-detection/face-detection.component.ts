import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, first, startWith, takeUntil, tap } from 'rxjs/operators';
import { createSubject } from 'src/app/lib/core/rxjs/helpers';
import { doLog } from 'src/app/lib/core/rxjs/operators';
import { logError } from '../../helpers';
import { OpenCVFaceDetectorService } from '../opencv.service';
import { UserCameraService } from '../user-camera.service';

declare var cv: any;

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styles: [
    `
    .hidden-video {
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

  private _detectedFrontFace$ = createSubject<any>();
  private _detectedLeftFrontFace$ = createSubject<any>();
  private _detectLeftFace$ = createSubject<{ image: HTMLVideoElement | undefined, canvas: HTMLCanvasElement | undefined }>();
  private _detectFrontFace$ = createSubject<{ image: HTMLVideoElement | undefined, canvas: HTMLCanvasElement | undefined }>();

  private videoHTMLElement!: HTMLVideoElement;
  private canvasHTMLElement!: HTMLCanvasElement;


  constructor(
    private cameraService: UserCameraService,
    private faceDetector: OpenCVFaceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const detectLeftProfilFace$ = this._detectLeftFace$
      .pipe(
        startWith({ image: undefined, canvas: undefined }),
        takeUntil(this._destroy$),
        tap(({ image, canvas }) => {
          if (image && canvas) {
            this.faceDetector.detectFaceOnVideoStream(
              image,
              canvas,
              'haarcascade_profileface.xml',
              this.profilFaceHaarCascadeURL,
              this._detectedLeftFrontFace$
            )(
              this.faceDetector.cleanup
            ).pipe()
              .toPromise().then(_ => {
              }).catch(err => logError(cv, err));
          }
        })
      );
    const detectFrontFace$ = this._detectFrontFace$
      .pipe(
        startWith({ image: undefined, canvas: undefined }),
        takeUntil(this._destroy$),
        tap(({ image, canvas }) => {
          if (image && canvas) {
            this.faceDetector.detectFaceOnVideoStream(
              image,
              canvas,
              'haarcascade_frontalface_default.xml',
              this.frontFaceHaarCascadeURL,
              this._detectedFrontFace$
            )(
              this.faceDetector.cleanup
            ).pipe()
              .toPromise().then(_ => {
              }).catch(err => logError(cv, err));
          }
        })
      );
    detectLeftProfilFace$.subscribe();
    detectFrontFace$.subscribe();
  }

  async ngOnInit() {

    // Detected Front face
    const detectedFrontFace$ = this._detectedFrontFace$
      .asObservable()
      .pipe(
        filter(state => state?.totalFaces === 1),
        takeUntil(this._destroy$),
        first(),
        doLog('Face detector state: '),
        tap(async (state) => {
          if (state?.x && state?.y && state?.width && state?.height) {
            const result = this.onFacePointDetected(this.videoHTMLElement, state);
            // Send Image with rect to facial recognation system for comparison
            this.outputImage.nativeElement.src = result;
            this.frontFaceDataURI.emit(result);
          }
        })
      );
    const detectedLeftFace$ = this._detectedLeftFrontFace$
      .asObservable()
      .pipe(
        filter(state => state?.totalFaces === 1),
        takeUntil(this._destroy$),
        first(),
        doLog('Left Face detector state: '),
        tap(async (state) => {
          if (state?.x && state?.y && state?.width && state?.height) {
            const result = this.onFacePointDetected(this.videoHTMLElement, state);
            // Send Image with rect to facial recognation system for comparison
            this.outputImage.nativeElement.src = result;
            this.profilFaceDataURI.emit(result);
          }
        })
      );
    detectedFrontFace$.subscribe();
    detectedLeftFace$.subscribe();
  }

  async ngAfterViewInit() {
    this.videoHTMLElement = this.videoElement.nativeElement as HTMLVideoElement;
    this.canvasHTMLElement = this.canvasElement.nativeElement as HTMLCanvasElement;
    await this.cameraService.startCamera(
      this.videoHTMLElement,
      'qvga',
      (_, dst) => {
        this._detectFrontFace$.next({ image: dst, canvas: this.canvasHTMLElement });
      }
    );
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
  }

}
