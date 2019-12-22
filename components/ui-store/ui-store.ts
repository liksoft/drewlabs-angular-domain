import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UIState, initialUIState } from './ui-state';

@Injectable({
  providedIn: 'root'
})
export class AppUIStore {
  private appuiState: BehaviorSubject<UIState> = new BehaviorSubject(
    initialUIState
  );

  intialize() {
    this.appuiState.next(initialUIState);
  }

  get uiState() {
    return this.appuiState.asObservable();
  }

  startAction(message?: string) {
    this.appuiState.next({
      performingAction: true,
      uiMessage: message
    });
  }

  endAction(message?: string) {
    this.appuiState.next({
      performingAction: false,
      uiMessage: message
    });
  }
}
