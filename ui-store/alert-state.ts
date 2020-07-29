import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertConfig {
  type?: string;
  showAlert: boolean;
  message?: string;
}

const initialState: Partial<AlertConfig> = {};

@Injectable({
  providedIn: 'root'
})
export class AlertStateStore {

  private alertState: BehaviorSubject<Partial<AlertConfig>> = new BehaviorSubject(initialState);

  get alertState$() {
    return this.alertState.asObservable();
  }

  setState(state: Partial<AlertConfig>) {
    this.alertState.next(state);
  }
}
