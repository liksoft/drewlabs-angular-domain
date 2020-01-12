import { DropzoneModule } from './dropzone';
import { AppBreadcrumbComponent, BreadCrumbStore } from './app-breadcrumb';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoaderModule } from './loader/loader.module';
import { AppLoaderModalComponent } from './app-loader-modal/app-loader-modal.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DynamicComponentService } from './services/dynamic-component-resolver.service';
import { NgDataTableModule } from './ng-data-table/ng-data-table.module';
import { AppAlertModule } from './app-alert';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { ClarityModule } from '@clr/angular';
import { DynamicFormControlModule } from './dynamic-inputs/dynamic-form-control';
import { OnlineStateMonitoringComponent } from './online-state-monitoring/online-state-monitoring.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoaderModule,
    NgDataTableModule,
    AppAlertModule.forRoot(),
    ProgressBarModule,
    ClarityModule,
    DropzoneModule,
    DynamicFormControlModule.forRoot()
  ],
  exports: [
    AppBreadcrumbComponent,
    AppLoaderModalComponent,
    LoaderModule,
    PaginatorComponent,
    ProgressBarModule,
    NgDataTableModule,
    AppAlertModule,
    DropzoneModule,
    DynamicFormControlModule,
    OnlineStateMonitoringComponent,
  ],
  declarations: [
    AppBreadcrumbComponent,
    AppLoaderModalComponent,
    PaginatorComponent,
    OnlineStateMonitoringComponent,
  ],
  providers: [
    BreadCrumbStore
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
