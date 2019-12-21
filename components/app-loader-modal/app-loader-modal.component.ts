import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppUIStore } from '../ui-store/ui-store';
import { UIState } from '../ui-store/ui-state';

@Component({
  selector: 'app-loader-modal',
  templateUrl: './app-loader-modal.component.html',
  styleUrls: ['./app-loader-modal.component.css']
})
export class AppLoaderModalComponent implements OnInit {
  showModal: boolean;
  modalMessage: string;
  performingAction: boolean;
  @Output() closed: EventEmitter<object> = new EventEmitter<object>();
  constructor(private appUIStore: AppUIStore) {
    this.performingAction = true;
  }

  get showLoader() {
    return this.performingAction;
  }

  get closeMessage() {
    return 'OK';
  }

  get uiActionChecker() {
    return this.appUIStore.uiState.subscribe(
      (uiState: UIState) => uiState.performingAction
    );
  }
  ngOnInit() {
    this.appUIStore.uiState.subscribe((uiState: UIState) => {
      this.modalMessage = uiState.uiMessage as string;
    });
  }

  public show(message: string, showLoader: boolean = true) {
    this.showModal = true;
    this.performingAction = showLoader;
    this.appUIStore.startAction(message);
  }

  public hide(message: string = '') {
    this.showModal = false;
    this.appUIStore.endAction(message);
    this.closed.emit({});
  }
}
