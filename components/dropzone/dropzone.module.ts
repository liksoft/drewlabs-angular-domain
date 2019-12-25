import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import {
  DropzoneModule as DZModule,
  DropzoneConfigInterface,
  DROPZONE_CONFIG
} from 'ngx-dropzone-wrapper';
import { NgModule } from '@angular/core';
import { DropzoneComponent } from './dropzone.component';
import { DropzoneService } from './dropzone.service';
import { ClarityModule } from '@clr/angular';

const DEFAULT_CONFIG: DropzoneConfigInterface = {
  url: environment.apiFileUploadURL,
  maxFilesize: 10,
  acceptedFiles: null,
  autoProcessQueue: false,
  uploadMultiple: false,
  maxFiles: 1,
  addRemoveLinks: true
};

@NgModule({
  imports: [CommonModule, DZModule, ClarityModule, TranslateModule],
  declarations: [DropzoneComponent],
  exports: [DropzoneComponent],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_CONFIG
    },
    DropzoneService
  ]
})
export class DropzoneModule {}
