import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FaceDetectionComponent } from "./face-detection.component";
import { WebcamModule } from "../webcam";
import { TFJSModule } from "../tfjs/ng";

@NgModule({
  imports: [CommonModule, WebcamModule, TFJSModule],
  exports: [FaceDetectionComponent],
  declarations: [FaceDetectionComponent],
})
export class FaceDetectionModule {
  static forRoot(): ModuleWithProviders<FaceDetectionModule> {
    return {
      ngModule: FaceDetectionModule,
      providers: [],
    };
  }
}
