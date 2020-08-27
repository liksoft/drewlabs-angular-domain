import { AppAlertComponent } from './app-alert/app-alert.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ActionAlertComponent } from './action-alert/action-alert.component';
import { DrewlabsActionStatusNotificationComponent } from './v2/notification-alert-container';

@NgModule({
  declarations: [AppAlertComponent, ActionAlertComponent, DrewlabsActionStatusNotificationComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AppAlertComponent, ActionAlertComponent, DrewlabsActionStatusNotificationComponent]
})
export class ActionAlertModule {
  static forRoot(): ModuleWithProviders<ActionAlertModule> {
    return {
      ngModule: ActionAlertModule,
      providers: []
    };
  }
}
