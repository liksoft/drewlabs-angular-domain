import { DropzoneModule } from './dropzone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgDataTableModule } from './ng-data-table/ng-data-table.module';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { ClarityModule } from '@clr/angular';
import { DynamicFormControlModule } from './dynamic-inputs/dynamic-form-control';
import { OnlineStateMonitoringComponent } from './online-state-monitoring/online-state-monitoring.component';
import { ActionAlertModule } from './action-alert';
import { CustomPipesModule } from './pipes/custom-pipes.module';
import { DynamicFormPageComponent } from '../helpers/component-reactive-form-helpers';
import { PageComponent, AlertablePageComponent } from '../helpers/component-interfaces';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgDataTableModule,
    ActionAlertModule.forRoot(),
    ProgressBarModule,
    ClarityModule,
    DropzoneModule,
  ],
  exports: [
    ProgressBarModule,
    NgDataTableModule,
    ActionAlertModule,
    DropzoneModule,
    DynamicFormControlModule,
    OnlineStateMonitoringComponent,
    CustomPipesModule
  ],
  declarations: [
    OnlineStateMonitoringComponent,

    // These component must be removed in future version
    DynamicFormPageComponent,
    PageComponent,
    AlertablePageComponent
  ],
  providers: []
})
export class CoreComponentModule {
  static forChild(): ModuleWithProviders<CoreComponentModule> {
    return {
      ngModule: CoreComponentModule,
      providers: []
    };
  }
  static forRoot(): ModuleWithProviders<CoreComponentModule> {
    return {
      ngModule: CoreComponentModule,
      providers: []
    };
  }
}
