import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { NgTableContentComponent } from './ng-table-content.component';
import { NgDataTableComponent } from './ng-data-table.component';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ClarityModule,
    CommonModule,
    ProgressBarModule,
    TranslateModule
  ],
  exports: [
    ClarityModule,
    NgDataTableComponent
  ],
  declarations: [
    NgTableContentComponent,
    NgDataTableComponent
  ]
})
export class NgDataTableModule {}
