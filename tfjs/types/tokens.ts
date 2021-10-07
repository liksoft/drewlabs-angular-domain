import { InjectionToken } from "@angular/core";
import { BlazeFaceDetector } from "./blazeface";
import { FaceMeshDetector } from "./facemesh";

export const BLAZE_FACE = new InjectionToken<BlazeFaceDetector>("BLAZE FACE PROVIDER");

export const FACE_MESH = new InjectionToken<FaceMeshDetector>(
  "FACE MESH PROVIDER"
);
