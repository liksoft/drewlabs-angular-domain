import { Injectable } from '@angular/core';
import { AlertStateStore, AlertConfig } from './alert-state';
import { createSubject } from '../rxjs/helpers/index';
import { startWith } from 'rxjs/operators';
import { DrewlabsHttpResponseStatusCode } from '../http/core/http-response';
import { HTTPErrorState } from '../http/core';

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

@Injectable({
  providedIn: 'root'
})
export class AppUIStateWrapper {

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

  public completeUIStoreAction(message?: string, alertConfigs?: AlertConfig) {
    this.uiStore.endAction(message);
    if (alertConfigs) {
      this.alertStore.setState(alertConfigs);
    } else {
      this.alertStore.setState({ type: '', showAlert: false });
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
    this.alertStore.setState(alertConfigs);
  }

  public resetUIStore() {
    this.uiStore.intialize();
    this.alertStore.setState({});
  }
}
