import { AlertConfig } from '../components/action-alert/app-alert/app-alert.component';
import { AppUIStore } from '../components/ui-store/ui-store';
import { Injectable } from '@angular/core';
import { IResponseBody } from '../http/contracts/http-response-data';
import { isDefined } from '../utils/type-utils';


export interface ActionResponseParams { res: IResponseBody | boolean; okMsg?: string; badReqMsg?: string; errorMsg?: string; }

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
  constructor(private uiStore: AppUIStore) { }

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
      this._alertConfigs = { type: '', showAlert: false };
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

  public onActionResponse(params: ActionResponseParams) {
    try {
      if (typeof params.res === 'boolean') {
        this.completeActionWithSuccess(params.okMsg);
        return;
      }
      if (isDefined(params.res) && isDefined(params.badReqMsg) && params.res.errors) {
        this.completeActionWithWarning(params.badReqMsg);
      } else if (isDefined(params.res) && isDefined(params.okMsg)) {
        this.completeActionWithSuccess(params.okMsg);
      } else if (isDefined(params.res) && isDefined(params.errorMsg)) {
        this.completeActionWithWarning(params.errorMsg);
      }
    } catch (error) {
      this.completeActionWithWarning(params.errorMsg);
    }
  }

  public resetUIStore() {
    this.uiStore.intialize();
    this._alertConfigs = {} as AlertConfig;
  }
}
