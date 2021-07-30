import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'drewlabs-action-notification-container',
  template: `
    <div [@slideInRight] class="alert-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
  animations: [
    trigger(
      'slideInRight', [
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate('150ms ease-in')
      ]),
      transition('* => void', [
        animate('150ms ease-out', style({
          opacity: 0
        }))
      ]),
    ],
    )
  ]
})
export class DrewlabsActionStatusNotificationComponent {}
