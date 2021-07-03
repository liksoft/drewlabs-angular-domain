import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { createSubject } from 'src/app/lib/core/rxjs/helpers';
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
  @ViewChild('sceneImage') sceneImage!: ElementRef;


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
        first(),
        tap(async (state) => {
          if (state?.x && state?.y && state?.width && state?.height) {
            const canvas = this.document.createElement("canvas");
            const {videoWidth, videoHeight} = video;
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = videoWidth;
              canvas.height = videoHeight;
              const x = state?.x;
              const y = state?.y;
              const width = state?.width;
              const height = state?.height + 12;
              context?.drawImage(video, 0, 0);
              // this.sceneImage.nativeElement.src = canvas.toDataURL();
              context.lineWidth = 1;
              context.strokeStyle = "green";
              context.strokeRect(x, y, width, height);
              // Send Image with rect to facial recognation system for comparison
              this.outputImage.nativeElement.src = canvas.toDataURL();
            }
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
