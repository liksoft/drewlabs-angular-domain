export interface FaceDetectionComponentState {
  loadingModel: boolean;
  loadingCamera: boolean;
  totalFaceDetected: number | undefined;
  base64Data: string | undefined;
  hasCanvas: boolean;
  hasError: boolean;
  detecting: boolean;
  switchingCamera?: boolean;
}
