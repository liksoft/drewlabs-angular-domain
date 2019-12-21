import { AppAlertComponent, AlertService } from './app-alert.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppAlertComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AppAlertComponent]
})
export class AppAlertModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppAlertModule,
      providers: [AlertService]
    };
  }
}
