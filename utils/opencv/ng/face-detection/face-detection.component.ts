import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { first, takeUntil, tap } from 'rxjs/operators';
import { createSubject } from 'src/app/lib/core/rxjs/helpers';
import { readFileAsDataURI } from '../../../browser';
import { Log } from '../../../logger';
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
export class FaceDetectionComponent implements AfterViewInit, OnDestroy {

  @Input() width: number = 320;
  @Input() height: number = 240;
  base64String!: string|undefined;

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('outputImage') outputImage!: ElementRef;


  private _destroy$ = createSubject();
  private _frontalFaceDetected = false;

  @Input() frontalFaceHaarCascadeURL: string = '/assets/resources/vendor/haarcascade_frontalface_default.xml';


  constructor(
    private cameraService: UserCameraService,
    private faceDetector: OpenCVFaceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  async ngAfterViewInit() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
    await this.cameraService.startCamera(
      video,
      'qvga',
      (_, dst) => {
        this.faceDetector.detectFaceOnVideoStream(
          dst,
          canvas,
          'haarcascade_frontalface_default.xml',
          this.frontalFaceHaarCascadeURL
        ).pipe()
          .toPromise().then(_ => {
          }).catch(err => logError(cv, err));
      }
    );


    this.faceDetector.detectedFace$
      .pipe(
        // takeUntil(this._destroy$),
        first(),
        tap(async (state) => {
          if (state) {
            // this._frontalFaceDetected = true;
            // const _canvas = this.document.createElement('canvas');
            // const context = _canvas.getContext('2d');
            // const image = new Image();
            // image.crossOrigin = 'anonymous';

            // image.onload = () => {
            //   const { width, height } = image;
            //   canvas.width = width,
            //     canvas.height = height;
            //   context?.drawImage(image, 0, 0, width, height);
            // };
            this.base64String = await readFileAsDataURI(state?.image);
            console.log(this.base64String);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
