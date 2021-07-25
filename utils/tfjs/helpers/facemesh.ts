import * as model from '@tensorflow-models/face-landmarks-detection';
import { FaceLandmarksPrediction, SupportedPackages } from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';

/**
 * Load the facelandmarks detector model
 * @param type
 */
export const loadModel = async (type?: SupportedPackages) => await model.load(type || model.SupportedPackages.mediapipeFacemesh);

/**
 * Predict face points using Face mesh model
 * @param model_
 * @param element
 */
export const predict = async (
  model_: model.FaceLandmarksDetector,
  element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement | ImageData | undefined
) => {
  return new Promise<FaceLandmarksPrediction[]|undefined>((resolve, _) => {
    if (element) {
      resolve(model_.estimateFaces({ input: element }));
    } else {
      resolve(undefined);
    }
  })
};

/**
 * Estimates face points on an HTML{Video|Canvas|Image}Element
 * @param element
 */
export const estimateFaces = async (
  element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
) => await predict(await loadModel(), element);
