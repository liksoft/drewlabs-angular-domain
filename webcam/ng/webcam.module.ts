import { ModuleWithProviders, NgModule } from "@angular/core";
import { WEBCAM } from "../types";
import { CameraDirective } from "./webcam.directive";
import { WebcamService } from "./webcam.service";

@NgModule({
  declarations: [CameraDirective],
  exports: [CameraDirective],
  providers: [],
})
export class WebcamModule {
  static forRoot(): ModuleWithProviders<WebcamModule> {
    return {
      ngModule: WebcamModule,
      providers: [
        WebcamService,
        {
          provide: WEBCAM,
          useClass: WebcamService,
        },
      ],
    };
  }
}
