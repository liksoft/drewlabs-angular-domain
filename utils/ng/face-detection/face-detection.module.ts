import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FaceDetectionComponent } from "./face-detection.component";
import { OPENCV_DEFAULT_OPTIONS } from "../../opencv/constants/options";
import { OPENCV_CONFIG_OPTIONS } from "../../opencv/ng";
import { OpenCVOptions } from "../../opencv/types/open-cv";
import { WebcamModule } from "../webcam";

@NgModule({
  imports: [
    CommonModule,
    WebcamModule
  ],
  exports: [
    FaceDetectionComponent
  ],
  declarations: [
    FaceDetectionComponent
  ]
})
export class FaceDetectionModule {
  static forRoot(config: { options?: OpenCVOptions }): ModuleWithProviders<FaceDetectionModule> {
    return {
      ngModule: FaceDetectionModule,
      providers: [
        { provide: OPENCV_CONFIG_OPTIONS, useValue: config?.options || OPENCV_DEFAULT_OPTIONS }
      ]
    };
  }
}
