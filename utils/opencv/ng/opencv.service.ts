import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, takeUntil, tap, } from "rxjs/operators";
import { createStateful, createSubject, observableFrom } from "../../../rxjs/helpers";
import { doLog } from "../../../rxjs/operators";
import { readFileAsDataURI } from "../../browser";
import { Log } from "../../logger";
import { WINDOW } from "../../ng/common/tokens/window";
import { isDefined, setObjectProperty } from "../../types";
import { OPENCV_DEFAULT_LOAD_RESULT } from "../constants/load-result";
import { OPENCV_DEFAULT_OPTIONS } from "../constants/options";
import { logError } from "../helpers";
import { OpenCVLoadResult, OpenCVOptions, Point } from "../types/open-cv";
import { OPENCV_CONFIG_OPTIONS } from "./tokens";

declare var cv: any;

export interface OpenCVProviderInterface {
    loadOpenCV(name: string, path: string): Observable<any>;
}

// export class Utils {

//     static getContours = (
//         src: any,
//         dest1: any,
//         dest3: any,
//         dest4: any,
//         width: number,
//         height: number
//     ) => {
//         cv.cvtColor(src, dest1, cv.COLOR_RGBA2GRAY);
//         cv.threshold(dest1, dest4, 120, 200, cv.THRESH_BINARY);
//         const contours = new cv.MatVector();
//         const hierarchy = new cv.Mat();
//         cv.findContours(dest4, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE, {
//             x: 0,
//             y: 0
//         });
//         dest3.delete();
//         dest3 = cv.Mat.ones(height, width, cv.CV_8UC3);
//         for (let i = 0; i < contours.size(); ++i) {
//             const color = new cv.Scalar(0, 255, 0);
//             cv.drawContours(dest3, contours, i, color, 1, cv.LINE_8, hierarchy);
//         }
//         contours.delete();
//         hierarchy.delete();
//         return dest3;
//     }
// }


@Injectable({
    providedIn: 'root'
})
export class OpenCVSvervice implements OpenCVProviderInterface {

    private _readyState$ = createStateful<OpenCVLoadResult>(OPENCV_DEFAULT_LOAD_RESULT);

    get readyState$() {
        return this._readyState$;
    }

    private _compiledLibraryURL!: string;

    constructor(
        @Inject(OPENCV_CONFIG_OPTIONS) options: OpenCVOptions,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document: Document,
        private _httpClient: HttpClient
    ) {
        this._compiledLibraryURL = options?.scriptUrl || this._compiledLibraryURL;
        this.loadLibrary({ ...OPENCV_DEFAULT_OPTIONS, ...options });
    }

    public loadLibrary = (options: OpenCVOptions) => {
        if (isDefined(cv)) {
            this._onScriptLoaded(options);
        } else {
            this.window = setObjectProperty(this.window, 'Module', { ...options });
            const script = this.document.createElement('script');
            script.setAttribute('async', '');
            script.setAttribute('type', 'text/javascript');
            script.addEventListener('load', () => this._onScriptLoaded(options));
            script.addEventListener('error', () => {
                const err = logError(cv, 'Failed to load ' + this._compiledLibraryURL);
                this.readyState$.next({
                    ready: false,
                    hasError: true,
                    loading: false
                });
                this._readyState$.error(err);
            });
            script.src = this._compiledLibraryURL;
            const node = this.document.getElementsByTagName('script')[0];
            if (node) {
                node.parentNode?.insertBefore(script, node);
            } else {
                this.document.head.appendChild(script);
            }
        }
    }

    private _onScriptLoaded = (options: OpenCVOptions) => {
        const onRuntimeInitializedCallback = () => {
            if (options.onRuntimeInitialized) {
                options.onRuntimeInitialized();
            }
            this._readyState$.next({
                ready: true,
                hasError: false,
                loading: false
            });
        };
        cv.onRuntimeInitialized = onRuntimeInitializedCallback;
    }

    loadOpenCV = (name: string, path: string) => {
        return this._httpClient.get(path, {
            headers: new HttpHeaders().append('Content-Type', 'application/xml'),
            responseType: 'arraybuffer'
        }).pipe(
            map(result => {
                const classifier = new cv.CascadeClassifier();
                cv.FS_createDataFile('/', name, new Uint8Array(result), true, true, false);
                classifier.load(name);
                return classifier;
            }),
            catchError(err => {
                logError(cv, err);
                return throwError(err);
            })
        )
    }

    loadImageToHTMLCanvas = (id: string, buffer: string) => {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this.document.querySelector(id) as HTMLCanvasElement;
        return this.loadImageToCanvas(canvas, buffer);
    };

    public loadImageToCanvas = (canvas: HTMLCanvasElement, buffer: string) => {
        return observableFrom(new Promise<{}>((resolve, reject) => {
            // Get 2d context
            const context = canvas.getContext('2d');
            const image = new Image();
            image.crossOrigin = 'anonymous';

            image.onload = () => {
                const { width, height } = image;
                canvas.width = width,
                    canvas.height = height;
                context?.drawImage(image, 0, 0, width, height);
                resolve({});
            };
            image.src = buffer;
        }));
    }

}


@Injectable({
    providedIn: 'root'
})
export class OpenCVFaceDetectorService implements OnDestroy {

    private _detectedFace$ = createSubject<{ point?: Point, image?: Blob }>();
    get detectedFace$() {
        return this._detectedFace$.asObservable();
    }
    public readonly cleanResources$ = createSubject<void>();

    private _destroy$ = createSubject();

    private ressources: any[] = [];

    constructor(private service: OpenCVSvervice) {
        this.cleanResources$.pipe(
            takeUntil(this._destroy$),
            doLog('Taking until...'),
            tap(_ => {
                this.ressources.forEach(resource => {
                    try {
                        resource.delete();
                    } catch (error) {
                        Log('Error calling delete: ', error);
                    }
                })
            })
        );
    }


    private detectFace = async (
        classifier: any,
        canvas: any,
        src: any,
        dst: any,
        gray: any,
        cap: any,
        faces: any,
        FPS: number = 30) => {

        const start = Date.now();
        cap.read(src);
        src.copyTo(dst);
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // detect faces.

        try {
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        } catch (err) {
            logError(cv, err);
        }
        // draw faces.
        if (faces?.size() > 1) {
            // TODO : Notify too many faces
        } else {
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width + 4, face.y + face.height + 6);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
                const rect = new cv.Rect(face.x, face.y, face.width, face.height);
                const point: Point = { x: face?.y, y: face?.y, dx: face?.width + 8, dy: face?.height + 10 };
                this._detectedFace$.next({ point, image: new Blob([dst.clone().roi(rect).data.buffer]) });
            }
        }
        cv.imshow(canvas, dst);
        // schedule the next one.
        let delay = 1000 / FPS - (Date.now() - start);
        setTimeout(() => {
            this.detectFace(
                classifier,
                canvas,
                src,
                dst,
                gray,
                cap,
                faces,
                FPS
            );
        }, delay);
        return { src, dst, gray, cap, classifier, delay };
    }

    detectFaceOnVideoStream = (
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        haarclassifier: string,
        url: string
    ) => {
        const { width, height } = video;
        let src = new cv.Mat(height, width, cv.CV_8UC4);
        const dst = new cv.Mat(height, width, cv.CV_8UC4);
        const gray = new cv.Mat();
        let cap = new cv.VideoCapture(video);
        let faces = new cv.RectVector();
        return this.service.loadOpenCV(haarclassifier, url)
            .pipe(
                map(classifier => {
                    this.ressources = [...[classifier, src, dst, cap, faces]];
                    return this.detectFace(classifier, canvas, src, dst, gray, cap, faces);
                }),
                catchError(err => {
                    return throwError(err);
                })
            );
    }

    ngOnDestroy(): void {
        this._destroy$.next();
    }
}