import { AppAlertComponent } from './app-alert/app-alert.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { DrewlabsActionStatusNotificationComponent } from './v2/notification-alert-container';

@NgModule({
  declarations: [AppAlertComponent, DrewlabsActionStatusNotificationComponent],
  imports: [ClarityModule, CommonModule],
  exports: [AppAlertComponent, DrewlabsActionStatusNotificationComponent]
})
export class ActionAlertModule {
  static forRoot(): ModuleWithProviders<ActionAlertModule> {
    return {
      ngModule: ActionAlertModule,
      providers: []
    };
  }
}
