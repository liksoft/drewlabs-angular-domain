import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { AppUIStateWrapper } from '../../../ui-store';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'drewlabs-action-alert',
  template: `
    <div class="text-center">
      <ng-container *ngIf="vm$ | async as vm">
      <app-alert
        *ngIf="vm?.alertState?.showAlert"
        [isAppLevel]="true"
        [showCloseActionButton]="true"
        [alertType]="vm?.alertState?.type"
        [alertMessage]="vm?.uiState?.uiMessage"
        (hideAlert)="uiStore.completeUIStoreAction()"
        [showIcon]="false">
      </app-alert>
      </ng-container>
    </div>
  `,
  styles: [
    `
    .text-center {
      text-align: center;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionAlertComponent {

  public uiStoreSubscriptions: Subscription[] = [];

  constructor(public readonly uiStore: AppUIStateWrapper) { }

  get vm$() {
    return combineLatest([
      this.uiStore.alertState$,
      this.uiStore.appUIStore.uiState
    ]).pipe(
      map(([alertState, uiState]) => ({ alertState, uiState }))
    );
  }

}
