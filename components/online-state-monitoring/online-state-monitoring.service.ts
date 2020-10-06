import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowRef } from '../../utils';
import { createStateful } from '../../rxjs/helpers';

/**
 * @description Enumerated values specifying the connection status of the current application navigator
 */
export enum ConnectionStatus {
  OFFLINE = 0,
  ONLINE = 1,
}


enum EventType {
  ONLINE_EVENT = 'online',
  OFFLINE_EVENT = 'offline'
}

@Injectable({
  providedIn: 'root'
})
export class OnlineStateMonitoringService implements OnDestroy {

  // tslint:disable-next-line: variable-name
  private _connectionStatus: BehaviorSubject<ConnectionStatus> = createStateful(ConnectionStatus.ONLINE);
  connectionStatus$ = this._connectionStatus.asObservable();

  constructor(private windowRef: WindowRef) { }

  registerToConnectionStates = () => {
    this.windowRef.nativeWindow.addEventListener(EventType.ONLINE_EVENT, () => {
      this._connectionStatus.next(ConnectionStatus.ONLINE);
    });
    this.windowRef.nativeWindow.addEventListener(EventType.OFFLINE_EVENT, () => {
      this._connectionStatus.next(ConnectionStatus.OFFLINE);
    });
  }

  setState = (state: ConnectionStatus) => {
    this._connectionStatus.next(state);
  }

  ngOnDestroy(): void {
    this.windowRef.nativeWindow.removeEventListener(EventType.ONLINE_EVENT, () => {});
    this.windowRef.nativeWindow.removeEventListener(EventType.OFFLINE_EVENT, () => {});
    this._connectionStatus.complete();
  }
}
