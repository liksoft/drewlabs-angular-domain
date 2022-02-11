import * as model from '@tensorflow-models/blazeface';
import { BlazeModelConfig } from '../types';

/**
 * Load the blaze face detector model
 * @param type
 */
export const loadModel = async (config?: BlazeModelConfig) => await model.load(config);

/**
 * Predict face points
 *
 * @param model_
 * @param element
 */
export const predict = async (
  model_: model.BlazeFaceModel,
  element: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement | ImageData | undefined
) => {
  return new Promise<model.NormalizedFace[] | undefined>((resolve, _) => {
    if (element && model) {
      resolve(model_.estimateFaces(element, false));
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


// export const
