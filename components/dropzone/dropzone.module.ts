import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  DropzoneModule as DZModule,
} from 'ngx-dropzone-wrapper';
import { NgModule } from '@angular/core';
import { DropzoneComponent } from './dropzone.component';
import { DropzoneService } from './dropzone.service';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [CommonModule, DZModule, ClarityModule, TranslateModule],
  declarations: [DropzoneComponent],
  exports: [DropzoneComponent],
  providers: [
    DropzoneService
  ]
})
export class DropzoneModule { }
