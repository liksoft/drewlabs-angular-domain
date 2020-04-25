import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injectable
} from '@angular/core';

@Injectable()
export class AlertService {
  private showAlertComponent = false;
  private type: string;

  get showAlert() {
    return this.showAlertComponent;
  }

  set showAlert(value: boolean) {
    this.showAlertComponent = value;
  }

  get alertType() {
    return this.type;
  }

  set alertType(value: string) {
    this.type = value;
  }

  public setAlertTypeAndShowAlert(type: string) {
    this.showAlertComponent = true;
    this.type = type;
  }
}

export interface AlertConfig {
  type?: string;
  showAlert: boolean;
  message?: string;
}

@Component({
  selector: 'app-alert',
  template: `
    <div [class]="getAlertType()" role="alert">
      <div class="alert-items">
        <div class="alert-item static">
          <ng-container *ngIf="showIcon">
            <div class="alert-icon-wrapper" [ngSwitch]="alertType">
              <clr-icon *ngSwitchCase="'alert-success'" class="alert-icon" shape="check-circle"></clr-icon>
              <clr-icon *ngSwitchCase="'alert-danger'" class="alert-icon" shape="exclamation-circle"></clr-icon>
              <clr-icon *ngSwitchCase="'alert-warning'" class="alert-icon" shape="exclamation-triangle"></clr-icon>
              <clr-icon *ngSwitchDefault class="alert-icon" shape="check-circle"></clr-icon>
            </div>
          </ng-container>
          <div class="alert-text" [innerHTML]="alertMessage | safeWebContent"></div>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close" (click)="hideAlert.emit({})">
          <clr-icon aria-hidden="true" shape="close"></clr-icon>
      </button>
    </div>
  `,
  styles: [
    `
       .action-alert {
          /*  min-height: 100px !important;
          max-width: 320px !important;
          position: absolute !important;
          top: 58px !important;
          right: 0;
          box-shadow: 0rem 0rem 2px #d7d7d7;
          transition-property: position;
          transition-timing-function: linear;
          transition-duration: 10s; */
          z-index: 9999;

        }
        /* .action-alert .alert-text {
            text-align: center;
        }
        .alert-icon-wrapper {
            align-self: inherit !important;
        } */
    `
  ]
})
export class AppAlertComponent {
  @Input() alertMessage: string;
  @Input() showIcon = false;
  @Output() hideAlert = new EventEmitter<object>();
  @Input() icon: string;
  @Input() alertType = 'alert-success';
  // tslint:disable-next-line: no-inferrable-types
  @Input() isAppLevel: boolean = false;
  // tslint:disable-next-line: no-inferrable-types
  @Input() showCloseActionButton: boolean = false;

  /**
   * @description Component object initializer
   */
  constructor() { }

  /**
   * @description build the alert component class
   */
  getAlertType() {
    return `alert ${this.isAppLevel ? 'alert-app-level action-alert' : ''} ${this.alertType}`;
  }
}
