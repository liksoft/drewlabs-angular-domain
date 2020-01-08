import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnlineStateMonitoringService } from './online-state-monitoring.service';
import { Subscription } from 'rxjs';
import { isDefined } from '../../utils/type-utils';

@Component({
  selector: 'app-online-state-monitoring',
  templateUrl: './online-state-monitoring.component.html',
  styles: []
})
export class OnlineStateMonitoringComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: variable-name
  public _online: boolean;
  private subscriptions: Subscription[] = [];
  public wasOffline = false;
  public hideSuccessAfterTimeout = false;

  constructor(private provider: OnlineStateMonitoringService) { }

  ngOnInit() {
    this.provider.registerToConnectionStates();
    this.subscriptions.push(this.provider.connectionStatus.subscribe((value) => {
      if (isDefined(value)) {
        this.hideSuccessAfterTimeout = false;
        if (value === 0) {
          this.wasOffline = true;
          this._online = false;
        } else {
          this._online = true;
          setTimeout(() => {
            this.hideSuccessAfterTimeout = true;
          }, 2000);
        }
      }
    }));
  }

  /**
   * @description Getter for component [[_online]] property
   */
  get online() {
    return this._online;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((v) => v.unsubscribe());
  }
}
