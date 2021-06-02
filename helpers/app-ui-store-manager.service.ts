import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseBody } from '../http/contracts/http-response-data';
import { HTTPErrorState } from '../http/core/http-request.service';
import { DrewlabsHttpResponseStatusCode } from '../http/core/http-response';
import { createStateful } from '../rxjs/helpers';
import { isDefined } from '../utils';
import { Log } from '../utils/logger';
import { UIState as BaseUIState, UIStateProvider, UIStateStatusCode }  from '../contracts/ui-state';
import { AppUIStateProvider } from '../ui-state'


// tslint:disable-next-line: deprecation
export interface ActionResponseParams { res: IResponseBody | boolean | any; okMsg?: string; badReqMsg?: string; errorMsg?: string; }

// #region Application alert state
export interface AlertConfig {
  type?: string;
  showAlert: boolean;
  message?: string;
}

const initialAlertState: Partial<AlertConfig> = {};

/**
 * @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class AlertStateStore {

  private alertState = createStateful<Partial<AlertConfig>>(initialAlertState);

  // tslint:disable-next-line: typedef
  get alertState$() {
    return this.alertState.asObservable();
  }

  // tslint:disable-next-line: typedef
  setState(state: Partial<AlertConfig>) {
    this.alertState.next(state);
  }
}

// # endregion Application alert store


// #region Application UIStore provider


/**
 * @description UIstate status code helper for getting state from http response error status
 */
export const uiStatusUsingHttpErrorResponse = (httpErrorState: HTTPErrorState) =>
  (httpErrorState.status === DrewlabsHttpResponseStatusCode.SERVER_ERROR) ||
    (httpErrorState.status === DrewlabsHttpResponseStatusCode.UNKNOWN) ?
    UIStateStatusCode.ERROR : UIStateStatusCode.BAD_REQUEST;

export interface UIState extends BaseUIState {}

//#endregion Application UI store provider

//#region application UI store wrapper
/**
 * @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class AppUIStoreManager {

  /**
   * @description Service instance Initializer
   * @param uiStore [[AppUIStore]] Application UI store instance
   */
  constructor(private uiStore: AppUIStateProvider, private alertStore: AlertStateStore) { }

  get appUIStore(): UIStateProvider {
    return this.uiStore;
  }

  get alertState$(): Observable<Partial<AlertConfig>> {
    return this.alertStore.alertState$;
  }

  public completeUIStoreAction(message?: string, status?: any): void {
    this.uiStore.endAction(message, status);
  }

  public completeActionWithWarning(message: string): void {
    this.completeUIStoreAction(message, UIStateStatusCode.BAD_REQUEST);
  }

  public completeActionWithError(message: string): void {
    Log('Error Message: ', message);
    this.completeUIStoreAction(message, UIStateStatusCode.ERROR);
  }

  public completeActionWithSuccess(message: string): void {
    this.completeUIStoreAction(message, UIStateStatusCode.STATUS_OK);
  }

  public initializeUIStoreAction(message?: string, alertConfigs: AlertConfig = {} as AlertConfig): void {
    this.uiStore.startAction(message);
    this.alertStore.setState(alertConfigs);
  }


  public onActionResponse(params: ActionResponseParams): void {
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

  public resetUIStore(): void {
    this.uiStore.intialize();
    this.alertStore.setState({});
  }
}
//#endregion Application UI store wrapper


export { UIStateStatusCode } from  '../contracts/ui-state';
export { AppUIStateProvider } from '../ui-state'