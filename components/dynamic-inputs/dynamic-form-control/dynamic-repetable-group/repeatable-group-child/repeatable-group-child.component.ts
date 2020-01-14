import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDynamicForm } from '../../../core/contracts/dynamic-form';

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
export class RepeatableGroupChildComponent implements OnInit, OnDestroy {

  @Output() componentDestroyer: EventEmitter<object> = new EventEmitter();
  @Input() formGroup: FormGroup;
  @Input() form: IDynamicForm;
  @Input() isAccordionOpened = false;
  @Input() index: number;
  @Output() isAccordionOpenedChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }
}
