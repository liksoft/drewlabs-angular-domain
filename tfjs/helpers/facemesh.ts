import * as model from '@tensorflow-models/face-landmarks-detection';
import { FaceLandmarksPrediction, SupportedPackages } from '@tensorflow-models/face-landmarks-detection';
import { FaceLandmarksModelConfig } from '../types';

/**
 * Load the facelandmarks detector model
 * @param type
 */
export const loadModel = async (type?: SupportedPackages, config: FaceLandmarksModelConfig = { shouldLoadIrisModel: true }) => await model
  .load(type || model.SupportedPackages.mediapipeFacemesh, {
    ...config, shouldLoadIrisModel: config?.shouldLoadIrisModel || true
  });

/**
 * Predict face points using Face mesh model
 * @param model_
 * @param element
 */
export const predict = async (
  model_: model.FaceLandmarksDetector,
  element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement | ImageData | undefined
) => {
  return new Promise<FaceLandmarksPrediction[] | undefined>((resolve, _) => {
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
