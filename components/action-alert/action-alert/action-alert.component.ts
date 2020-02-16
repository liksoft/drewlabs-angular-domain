import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUIStoreManager } from '../../../helpers/app-ui-store-manager.service';
import { AlertConfig } from '../app-alert/app-alert.component';
import { UIState } from '../../ui-store/ui-state';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'drewlabs-action-alert',
  template: `
    <div class="text-center">
      <app-alert
        *ngIf="alertProperties.showAlert"
        [isAppLevel]="true"
        [showCloseActionButton]="true"
        [alertType]="alertProperties.type"
        [alertMessage]="actionUiMessage"
        (hideAlert)="onHideAlert()"
        [showIcon]="false">
      </app-alert>
    </div>
  `,
  styles: [
    `
    .text-center {
      text-align: center;
    }
    `
  ]
})
export class ActionAlertComponent implements OnInit {

  public performingAction = false;
  public actionUiMessage: string;
  public uiStoreSubscriptions: Subscription[] = [];

  constructor(private uiStore: AppUIStoreManager) { }

  onHideAlert() {
    this.uiStore.completeUIStoreAction();
  }

  /**
   * @description AlertProperties get that load the alert properties from app ui store provider
   */
  get alertProperties(): AlertConfig {
    return this.uiStore.alertConfigs;
  }

  /**
   * @description Subscribe to UI events on the inherited component
   */
  subscribeToUIActions() {
    this.uiStoreSubscriptions.push(
      this.uiStore.appUIStore.uiState.subscribe(
        (uiState: UIState) => {
          this.performingAction = uiState.performingAction;
          this.actionUiMessage = uiState.uiMessage;
        }
      )
    );
  }

  ngOnInit() {
    this.subscribeToUIActions();
  }

}
