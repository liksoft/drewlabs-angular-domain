
export class Video {

  static read(video: HTMLVideoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0);
    return context?.getImageData(0, 0, canvas?.width, canvas?.height);
  }

  static writeToCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    const context = canvas.getContext('2d');
    if (context && video) {
      canvas.width = video?.videoWidth;
      canvas.height = video?.videoHeight;
      context.drawImage(video, 0, 0, video?.videoWidth, video?.videoHeight);
    }
    return canvas;
  }
}
