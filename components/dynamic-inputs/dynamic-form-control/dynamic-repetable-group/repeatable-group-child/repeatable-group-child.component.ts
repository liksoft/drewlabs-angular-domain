import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { IDynamicForm } from '../../../core/contracts/dynamic-form';
import { AbstractAlertableComponent } from '../../../../../helpers/component-interfaces';
import { AppUIStoreManager } from '../../../../../helpers/app-ui-store-manager.service';

@Component({
  selector: 'app-repetable-group-child',
  templateUrl: 'repeatable-group-child.component.html',
  styles: [
    `
    .maring-bottom {
      margin-bottom: 16px;
    }
    .icon-variants {
      border: 1px dashed #666;
      border-radius: .15rem;
      cursor: pointer;
    }
    `
  ],
})
export class RepeatableGroupChildComponent extends AbstractAlertableComponent {

  @Output() componentDestroyer =  new EventEmitter();
  @Output() create = new EventEmitter<AbstractControl>();
  @Output() edit = new EventEmitter<AbstractControl>();
  @Input() formGroup: FormGroup;
  @Input() form: IDynamicForm;
  @Input() isAccordionOpened = false;
  @Input() index: number;
  @Output() isAccordionOpenedChange: EventEmitter<boolean> = new EventEmitter();
  @Input() showEditButton = false;
  // @Input() showCreateButton = false;

  constructor(uiStore: AppUIStoreManager) { super(uiStore); }
}
