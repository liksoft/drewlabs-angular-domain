import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UIState } from '../ui-store/ui-state';
import { AppUIStore } from '../ui-store/ui-store';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input() overlay = false;
  @Input() hidden = false;
  @Input() indeterminate = false;
  performingAction: boolean;
  uiStoreSubscriptions: Subscription[] = [];

  constructor(private appUiStore: AppUIStore) {}

  ngOnInit() {
    this.uiStoreSubscriptions.push(
      this.appUiStore.uiState.subscribe((state: UIState) => {
        this.performingAction = state.performingAction;
      })
    );
  }
}
