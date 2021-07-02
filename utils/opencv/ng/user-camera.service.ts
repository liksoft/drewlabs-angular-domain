import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { OnStartUserCameraHandlerFn, VideoConstraints } from "../types/user-camera";

@Injectable({
    providedIn: 'root'
})
export class UserCameraService {

    private _video!: HTMLVideoElement;
    private _stream!: MediaStream;
    private _onCameraStartedCallback!: OnStartUserCameraHandlerFn;

    constructor(@Inject(DOCUMENT) private document: Document) { }


    onVideoCanPlay() {
        if (this._onCameraStartedCallback) {
            this._onCameraStartedCallback(this._stream, this._video);
        }
    }

    startCameraInHTMLElement(
        videoId: string,
        resolution: string,
        callback: OnStartUserCameraHandlerFn,
    ) {

        let video = <HTMLVideoElement>this.document.getElementById(videoId);
        // Create a video element
        if (!video) {
            video = this.document.createElement('video');
        }
        return this.startCamera(video, resolution, callback);

    }

    startCamera = (
        video: HTMLVideoElement,
        resolution: string,
        callback: OnStartUserCameraHandlerFn
    ) => {
        const constraints: VideoConstraints = {
            qvga: { width: { exact: 320 }, height: { exact: 240 } },
            vga: { width: { exact: 640 }, height: { exact: 480 } }
        };

        // Get video constraints
        let videoConstraint: MediaTrackConstraints | boolean = constraints[resolution];
        if (!videoConstraint) {
            videoConstraint = true;
        }
        return new Promise((resolve, reject) => {
            navigator.mediaDevices
                .getUserMedia({ video: videoConstraint, audio: false })
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                    this._video = video;
                    this._stream = stream;
                    this._onCameraStartedCallback = callback;
                    video.addEventListener('canplay', this.onVideoCanPlay.bind(this), false);
                    resolve({});
                })
                .catch(err => {
                    reject(`User camera Error: ${err.name} - {err.message}`);
                });
        }); //
    }

    stopCamera() {
        this.dispose();
    }

    dispose = () => {
        if (this._video) {
            this._video.pause();
            this._video.srcObject = null;
            this._video.removeEventListener('canplay', this.onVideoCanPlay.bind(this));
        }
        if (this._stream) {
            this._stream.getVideoTracks()[0].stop();
        }
    }
}