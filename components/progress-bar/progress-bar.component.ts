import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  @Input() performingAction = false;

  constructor() {}
}
