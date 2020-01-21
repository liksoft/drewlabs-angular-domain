import { AppUIStore } from 'src/app/lib/domain/components/ui-store/ui-store';
import { AlertConfig } from 'src/app/lib/domain/components/app-alert/app-alert.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppUIStoreManager {
  // tslint:disable-next-line: variable-name
  private _alertConfigs: AlertConfig = {} as AlertConfig;

  /**
   * @description Service instance Initializer
   * @param uiStore [[AppUIStore]] Application UI store instance
   */
  constructor(private uiStore: AppUIStore) {}

  get appUIStore(): AppUIStore {
    return this.uiStore;
  }

  get alertConfigs() {
    return this._alertConfigs;
  }

  public completeUIStoreAction(message?: string, alertConfigs?: AlertConfig) {
    this.uiStore.endAction(message);
    if (alertConfigs) {
      this._alertConfigs = alertConfigs;
    } else {
      this._alertConfigs = {type: '', showAlert: false};
    }
  }

  public completeActionWithWarning(message: string) {
    this.completeUIStoreAction(message, {
      type: 'alert-warning',
      showAlert: true
    });
  }

  public completeActionWithError(message: string) {
    this.completeUIStoreAction(message, {
      type: 'alert-danger',
      showAlert: true
    });
  }

  public completeActionWithSuccess(message: string) {
    this.completeUIStoreAction(message, {
      type: 'alert-success',
      showAlert: true
    });
  }

  public initializeUIStoreAction(message?: string, alertConfigs: AlertConfig = {} as AlertConfig) {
    this.uiStore.startAction(message);
    this._alertConfigs = alertConfigs;
  }

  public resetUIStore() {
    this.uiStore.intialize();
    this._alertConfigs = {} as AlertConfig;
  }
}
