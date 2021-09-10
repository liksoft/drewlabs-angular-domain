import { ModuleWithProviders, NgModule } from "@angular/core";
import { CameraDirective } from "./camera/camera.directive";
import { UserCameraService } from "./user-camera.service";

@NgModule({
  declarations: [CameraDirective],
  exports: [CameraDirective],
  providers: [],
})
export class WebcamModule {
  static forRoot(): ModuleWithProviders<WebcamModule> {
    return {
      ngModule: WebcamModule,
      providers: [UserCameraService],
    };
  }
}
