import { ModuleWithProviders, NgModule } from "@angular/core";
import { OpenCVFaceDetectorService, OpenCVSvervice } from "./opencv.service";
import { OPENCV_DEFAULT_OPTIONS } from "../constants/options";
import { OPENCV_CONFIG_OPTIONS } from "../ng";
import { OpenCVOptions } from "../types/open-cv";

@NgModule()
export class OpenCVModule {
  static forRoot(config?: {
    options?: OpenCVOptions;
  }): ModuleWithProviders<OpenCVModule> {
    return {
      ngModule: OpenCVModule,
      providers: [
        OpenCVSvervice,
        OpenCVFaceDetectorService,
        {
          provide: OPENCV_CONFIG_OPTIONS,
          useValue: config?.options || OPENCV_DEFAULT_OPTIONS,
        },
      ],
    };
  }
}
