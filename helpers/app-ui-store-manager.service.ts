import { Injectable } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { IResponseBody } from '../http/contracts/http-response-data';
import { HTTPErrorState } from '../http/core/http-request.service';
import { DrewlabsHttpResponseStatusCode } from '../http/core/http-response';
import { createSubject, createStateful } from '../rxjs/helpers';
import { isDefined } from '../utils';


// tslint:disable-next-line: deprecation
export interface ActionResponseParams { res: IResponseBody | boolean | any; okMsg?: string; badReqMsg?: string; errorMsg?: string; }

// #region Application alert state
export interface AlertConfig {
  type?: string;
  showAlert: boolean;
  message?: string;
}

const initialAlertState: Partial<AlertConfig> = {};

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

export enum UIStateStatusCode {
  STATUS_OK = 200,
  STATUS_CREATED = 201,
  BAD_REQUEST = 422,
  ERROR = 500,
  UNAUTHORIZED = 401,
  AUTHENTICATED = 202,
  UNAUTHENTICATED = 403
}

/**
 * @description UIstate status code helper for getting state from http response error status
 */
export const uiStatusUsingHttpErrorResponse = (httpErrorState: HTTPErrorState) =>
  (httpErrorState.status === DrewlabsHttpResponseStatusCode.SERVER_ERROR) ||
    (httpErrorState.status === DrewlabsHttpResponseStatusCode.UNKNOWN) ?
    UIStateStatusCode.ERROR : UIStateStatusCode.BAD_REQUEST;

export interface UIState {
  performingAction: boolean;
  uiMessage?: string;
  hasError?: boolean;
  status?: number;
}

const initialUIState: UIState = {
  performingAction: false,
  uiMessage: null,
  hasError: false,
  status: null
};


@Injectable({
  providedIn: 'root'
})
export class AppUIStateProvider {
  private store$ = createSubject<UIState>();

  // tslint:disable-next-line: typedef
  intialize() {
    this.store$.next(initialUIState);
  }

  get uiState() {
    return this.store$.pipe(
      startWith(initialUIState)
    );
  }

  startAction(message?: string) {
    this.store$.next({
      performingAction: true,
      uiMessage: message,
      hasError: false,
      status: null
    });
  }

  endAction(message?: string, status?: UIStateStatusCode) {
    this.store$.next({
      performingAction: false,
      uiMessage: message,
      hasError: status === UIStateStatusCode.ERROR ? true : false,
      status
    });
  }

  resetState() {
    this.store$.next(initialUIState);
  }
}

//#endregion Application UI store provider

//#region application UI store wrapper
@Injectable({
  providedIn: 'root'
})
export class AppUIStoreManager {

  /**
   * @description Service instance Initializer
   * @param uiStore [[AppUIStore]] Application UI store instance
   */
  constructor(private uiStore: AppUIStateProvider, private alertStore: AlertStateStore) { }

  get appUIStore(): AppUIStateProvider {
    return this.uiStore;
  }

  get alertState$() {
    return this.alertStore.alertState$;
  }

  public completeUIStoreAction(message?: string, status?: any) {
    this.uiStore.endAction(message, status);
  }

  public completeActionWithWarning(message: string) {
    this.completeUIStoreAction(message, UIStateStatusCode.BAD_REQUEST);
  }

  public completeActionWithError(message: string) {
    this.completeUIStoreAction(message, UIStateStatusCode.ERROR);
  }

  public completeActionWithSuccess(message: string) {
    this.completeUIStoreAction(message, UIStateStatusCode.STATUS_OK);
  }

  public initializeUIStoreAction(message?: string, alertConfigs: AlertConfig = {} as AlertConfig) {
    this.uiStore.startAction(message);
    this.alertStore.setState(alertConfigs);
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
    this.alertStore.setState({});
  }
}
//#endregion Application UI store wrapper
