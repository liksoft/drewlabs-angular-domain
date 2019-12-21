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
  type: string;
  showAlert: boolean;
  message?: string;
}

@Component({
  selector: 'app-alert',
  template: `
    <div [class]="getAlertType()" role="alert">
      <div class="alert-items">
        <div class="alert-item static">
          <div *ngIf="showIcon" class="alert-icon-wrapper">
            <ng-container [ngSwitch]="alertType">
              <clr-icon
                *ngSwitchCase="'alert-success'"
                class="alert-icon"
                shape="check-circle"
              ></clr-icon>
              <clr-icon
                *ngSwitchCase="'alert-danger'"
                class="alert-icon"
                shape="exclamation-circle"
              ></clr-icon>
              <clr-icon
                *ngSwitchCase="'alert-warning'"
                class="alert-icon"
                shape="exclamation-triangle"
              ></clr-icon>
              <clr-icon
                *ngSwitchDefault
                class="alert-icon"
                shape="check-circle"
              ></clr-icon>
            </ng-container>
          </div>
          <span class="alert-text">{{ alertMessage }}</span>
        </div>
      </div>
    </div>
  `
})
export class AppAlertComponent {
  @Input() alertMessage: string;
  @Input() showIcon = false;
  @Output() iconCliked = new EventEmitter<any>();
  @Input() icon: string;
  @Input() alertType = 'alert-success';

  /**
   * @description Component object initializer
   */
  constructor() {}

  /**
   * @description build the alert component class
   */
  getAlertType() {
    return `alert ${this.alertType}`;
  }
}
