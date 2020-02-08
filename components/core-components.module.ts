import { DropzoneModule } from './dropzone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DynamicComponentService } from './services/dynamic-component-resolver.service';
import { NgDataTableModule } from './ng-data-table/ng-data-table.module';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { ClarityModule } from '@clr/angular';
import { DynamicFormControlModule } from './dynamic-inputs/dynamic-form-control';
import { OnlineStateMonitoringComponent } from './online-state-monitoring/online-state-monitoring.component';
import { ActionAlertModule } from './action-alert';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgDataTableModule,
    ActionAlertModule.forRoot(),
    ProgressBarModule,
    ClarityModule,
    DropzoneModule,
    DynamicFormControlModule.forRoot()
  ],
  exports: [
    ProgressBarModule,
    NgDataTableModule,
    ActionAlertModule,
    DropzoneModule,
    DynamicFormControlModule,
    OnlineStateMonitoringComponent,
  ],
  declarations: [
    OnlineStateMonitoringComponent,
  ],
  providers: [
  ]
})
export class CoreComponentModule {
  static forChild(): ModuleWithProviders {
    return {
      ngModule: CoreComponentModule,
      providers: []
    };
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreComponentModule,
      providers: [DynamicComponentService]
    };
  }
}
