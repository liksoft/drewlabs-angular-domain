import { AppUIStoreManager, UIState } from './app-ui-store-manager.service';
import { Subscription } from 'rxjs';
import { Directive, HostBinding } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';
import { isDefined } from '../utils';

export interface IFormViewComponent {
  /**
   * @description After form submission request submit successfully
   */
  onFormRequestSubmittedSuccessfully(): void;
}

/**
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
 * @description Helper class for applying [[@HostBinding('class.content-container')]] property
 * to the subclass in order to transform it into a clarity main-container view
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[elewouPage]'
})
export class PageComponent {
  @HostBinding('class.content-container') class = true;
}

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
 * Helper class that apply [[@HostBinding('class.content-container')]] to it subclass and provide methods and properties
 * to component for responding to ui events and actions
 */

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[elewouAlertablePage]'
})
// tslint:disable-next-line: directive-class-suffix
export class AlertablePageComponent extends AbstractAlertableComponent {
  @HostBinding('class.content-container') class = true;

  constructor(uiManager: AppUIStoreManager) {
    super(uiManager);
  }
}

/**
 * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
 * @param control AbstractControl
 * @returns AbstractControl
 */
export function cloneAbstractControl<T extends AbstractControl>(control: T): T {
  let newControl: T;

  if (control instanceof FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    const controls = control.controls;

    Object.keys(controls).forEach(key => {
      formGroup.addControl(key, cloneAbstractControl(controls[key]));
    });

    newControl = formGroup as any;
  } else if (control instanceof FormArray) {
    const formArray = new FormArray([], control.validator, control.asyncValidator);

    control.controls.forEach(formControl => formArray.push(cloneAbstractControl(formControl)));

    newControl = formArray as any;
  } else if (control instanceof FormControl) {
    newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
  } else {
    throw new Error('Error: unexpected control value');
  }

  if (control.disabled) { newControl.disable({emitEvent: false}); }

  return newControl;
}
