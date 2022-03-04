import { AppUIStoreManager, UIState } from './app-ui-store-manager.service';
import { Subscription } from 'rxjs';
import { Directive, HostBinding } from '@angular/core';
import { isDefined } from '../utils';


/**
 * @deprecated
 */
export interface IFormViewComponent {
  /**
   * @description After form submission request submit successfully
   */
  onFormRequestSubmittedSuccessfully(): void;
}

/**
 * @deprecated
 * @description A component that is wrapped arround a child component containing an HTML form
 */
export interface IFormParentComponent {

  /**
   * @description Handler for child component form submit event
   * @param event [[any]]
   */
  onChildComponentFormSubmitted(event: any): void;
}

/**
 * @deprecated
 * @description Helper class for applying [[@HostBinding('class.content-container')]] property
 * to the subclass in order to transform it into a clarity main-container view
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appPageComponentDirective]'
})
export class PageComponent {
  @HostBinding('class.content-container') class = true;
}

/**
 * @deprecated
 */
export abstract class AbstractAlertableComponent {

  public performingAction = false;
  public actionUiMessage: string;
  public uiStoreSubscriptions: Subscription[] = [];
  public componentIsInitialized = false;

  constructor(public appUIStoreManager: AppUIStoreManager) {}
  /**
   * @description AlertProperties get that load the alert properties from app ui store provider
   */
  get alertProperties() {
    return this.appUIStoreManager.alertState$;
  }
  /**
   * @description Subscribe to UI events on the inherited component
   */
  subscribeToUIActions() {
    this.uiStoreSubscriptions.push(
      this.appUIStoreManager.appUIStore.uiState.subscribe(
        (uiState: UIState) => {
          this.performingAction = uiState.performingAction;
          this.actionUiMessage = uiState.uiMessage;
        }
      )
    );
  }

  showBadRequestMessage(message: string) {
    this.appUIStoreManager.completeActionWithWarning(
      message
    );
  }

  showErrorMessage(message: string) {
    this.appUIStoreManager.completeActionWithError(
      message
    );
  }

  showSuccessMessage(message: string) {
    this.appUIStoreManager.completeActionWithSuccess(
      message
    );
  }

  /**
   * @description Unsubscribe from any ui event subscriptions
   */
  clearUIActionSubscriptions() {
    if (this.uiStoreSubscriptions.length > 0) {
      this.uiStoreSubscriptions.map(s => {
        if (isDefined(s)) {
          s.unsubscribe();
        }
      });
    }
  }

  /**
   * @description Calls the application UI Store reset method the reinit the ui store
   */
  resetUIStore() {
    this.appUIStoreManager.resetUIStore();
  }
}

/**
 * @deprecated
 * @description Helper class that apply [[@HostBinding('class.content-container')]] to it subclass and provide methods and properties
 * to component for responding to ui events and actions
 */

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appAlertablePageComponent]'
})
// tslint:disable-next-line: directive-class-suffix
export class AlertablePageComponent extends AbstractAlertableComponent {
  @HostBinding('class.content-container') class = true;

  constructor(uiManager: AppUIStoreManager) {
    super(uiManager);
  }
}

export { cloneAbstractControl } from  '../components/dynamic-inputs/angular';
