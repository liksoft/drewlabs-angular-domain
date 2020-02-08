import { AppAlertComponent, AlertService } from './app-alert/app-alert.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ActionAlertComponent } from './action-alert/action-alert.component';

@NgModule({
  declarations: [AppAlertComponent, ActionAlertComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AppAlertComponent, ActionAlertComponent]
})
export class ActionAlertModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ActionAlertModule,
      providers: [AlertService]
    };
  }
}
