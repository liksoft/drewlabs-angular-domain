import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IHTMLFormControl } from '../../core/contracts/dynamic-input';
import { DynamicInputTypeHelper } from '../input-type.service';

@Component({
  selector: 'app-dynamic-number-input',
  templateUrl: './dynamic-number-input.component.html',
  styles: [
    `
    .required-text,
    .field-has-error {
      color: rgb(241, 50, 50);
    }

    .clr-input-wrapper .clr-input:disabled {
      background: rgba(244, 244, 244, .3);
    }
    /* .clr-subtext {
        margin-top: 1rem !important;
    } */
    `
  ]
})
export class DynamicNumberInputComponent {

  @Input() controlDivContainerClass: string = 'clr-form-control';
  @Input() control: AbstractControl;
  @Input() showLabelAndDescription = true;
  // Configuration parameters of the input
  @Input() inputConfig: IHTMLFormControl;

  @Output() inputKeyUp = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeyDown = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputKeypress = new EventEmitter<{ formcontrolname: string, value: any }>();
  @Output() inputBlur = new EventEmitter<{ formcontrolname: string, value: any }>();

  constructor(public readonly inputTypeHelper: DynamicInputTypeHelper) { }

  maxNumberSize(): number {
    return Math.pow(2, 31) - 1;
  }

  getErrorAsNumber(value: object | number, key: string = null): number|string {
    return typeof value === 'number' ? value : value[key];
  }
}
