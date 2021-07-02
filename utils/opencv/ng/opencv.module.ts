import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { OPENCV_DEFAULT_OPTIONS } from "../constants/options";
import { OpenCVOptions } from "../types";
import { FaceDetectionComponent } from "./face-detection/face-detection.component";
import { OPENCV_CONFIG_OPTIONS } from "./tokens";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        FaceDetectionComponent
    ],
    declarations: [
        FaceDetectionComponent
    ]
})
export class OpenCVModule {
    static forRoot(config: { options?: OpenCVOptions }): ModuleWithProviders<OpenCVModule> {
        return {
            ngModule: OpenCVModule,
            providers: [
                { provide: OPENCV_CONFIG_OPTIONS, useValue: config?.options || OPENCV_DEFAULT_OPTIONS }
            ]
        };
    }
}