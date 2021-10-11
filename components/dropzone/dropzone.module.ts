import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { DropzoneComponent } from "./dropzone.component";
import { DropzoneService } from "./dropzone.service";
import { ClarityModule } from "@clr/angular";
import { DropzoneConfig, DROPZONE_CONFIG } from "./types";
import { DropzoneDirective } from "./dropzone.directive";

@NgModule({
  imports: [CommonModule, ClarityModule],
  declarations: [DropzoneComponent, DropzoneDirective],
  exports: [DropzoneComponent, DropzoneDirective],
  providers: [DropzoneService],
})
export class DropzoneModule {
  static forRoot(config: {
    dropzoneConfig: DropzoneConfig;
  }): ModuleWithProviders<DropzoneModule> {
    return {
      ngModule: DropzoneModule,
      providers: [
        {
          provide: DROPZONE_CONFIG,
          useValue: config?.dropzoneConfig,
        },
      ],
    };
  }
}
