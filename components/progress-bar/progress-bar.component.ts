import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppUIStateProvider } from '../../helpers/app-ui-store-manager.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() overlay = false;
  @Input() hidden = false;
  @Input() indeterminate = false;
  uiState$ = this.appUiStore.uiState;

  constructor(private appUiStore: AppUIStateProvider) {}
}
