import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectionStatus } from './connection-status';
import { WindowRef } from '../../utils';

enum EventType {
  ONLINE_EVENT = 'online',
  OFFLINE_EVENT = 'offline'
}

@Injectable({
  providedIn: 'root'
})
export class OnlineStateMonitoringService implements OnDestroy {

  public readonly connectionStatus: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(private windowRef: WindowRef) { }

  registerToConnectionStates() {
    this.windowRef.nativeWindow.addEventListener(EventType.ONLINE_EVENT, () => {
      this.connectionStatus.next(ConnectionStatus.ONLINE);
    });

    this.windowRef.nativeWindow.addEventListener(EventType.OFFLINE_EVENT, () => {
      this.connectionStatus.next(ConnectionStatus.OFFLINE);
    });
  }

  ngOnDestroy() {
    this.windowRef.nativeWindow.removeEventListener(EventType.ONLINE_EVENT, () => {});
    this.windowRef.nativeWindow.removeEventListener(EventType.OFFLINE_EVENT, () => {});
    this.connectionStatus.complete();
  }
}
